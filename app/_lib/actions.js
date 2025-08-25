"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTask } from "./data-service";

// MARK: LOGIN
export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Chyba pri prihlasovaní:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// MARK: LOGOUT
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Chyba pri odhlásení:", error);
    return { error: error.message };
  }

  redirect("/login");
}

// MARK: SIGNUP
export async function signup(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const re_password = formData.get("re_password");

  // Overenie, či sú všetky polia vyplnené
  if (!email || !password || !re_password) {
    return { error: "Všetky polia sú povinné." };
  }

  // Skontroluj, či už existuje profil s daným e-mailom
  const { data: existingProfile, error: profilesError } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  // Ak nastane iná chyba ako "záznam sa nenašiel", ohlás chybu
  if (profilesError && profilesError.code !== "PGRST116") {
    console.error(profilesError);
    return { error: "Email nie je možné načítať" };
  }

  // Ak používateľ s týmto emailom už existuje
  if (existingProfile) {
    return { error: "Užívateľ s týmto emailom už existuje" };
  }

  // Kontrola, či sa heslá zhodujú
  if (password !== re_password) {
    return { error: "Heslá sa nezhodujú." };
  }

  // Kontrola minimálnej dĺžky hesla
  if (password.length < 6) {
    return { error: "Heslo musí byť dlhšie ako 6 znakov." };
  }

  // Registrácia používateľa
  const { data: result, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Chyba pri registrácii:", error);
    return { error: error.message };
  }

  // Ošetrenie neautorizovaného používateľa (napr. pri probléme s tokenom)
  if (error?.status === 401) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Ak používateľ ešte nemá session – pošli ho overiť e-mail
  if (!result.session) {
    revalidatePath("/", "layout");
    redirect("/verify-email");
  }

  // V opačnom prípade – úspešná registrácia, presmeruj domov
  revalidatePath("/", "layout");
  redirect("/");
}

// MARK: INSERT/UPDATE PROFILES
export async function InsertUpdateProfilesData(formData) {
  const supabase = await createClient();

  // 🔐 Získame aktuálne prihláseného používateľa
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Nie je prihlásený používateľ", userError);
    redirect("/login");
  }

  // 🧾 Získanie aktuálneho profilu z databázy
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Chyba pri načítaní profilu:", profileError);
    return { error: "Nepodarilo sa načítať profil." };
  }

  const newData = {
    full_name: formData.get("full_name"),
    username: formData.get("username"),
    address: formData.get("address"),
    dateOfBirth: formData.get("dateOfBirth"),
    medCheckDate: formData.get("medCheckDate"),
    phone: formData.get("phone"),
  };

  // 🎯 Zistíme, ktoré polia sa skutočne zmenili
  const updatedFields = {};
  for (const key in newData) {
    if (newData[key] && newData[key] !== existingProfile?.[key]) {
      updatedFields[key] = newData[key];
    }
  }

  // 🖼 Práca s obrázkom (avatar)
  let avatar = formData.get("avatar");

  if (avatar && avatar instanceof File) {
    const avatarName = `${Date.now()}-${avatar.name}`.replace(/\s/g, "-");

    // ☁️ Upload obrázka do Supabase storage (bucket: "avatars")
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(avatarName, avatar, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.error("Chyba pri nahrávaní obrázka:", uploadError);
      return { error: "Nepodarilo sa nahrať obrázok." };
    }

    // 🌐 Vytvorenie URL k nahratému obrázku
    const avatarPath = `https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars/${avatarName}`;

    // 🔗 Pridáme URL obrázka do dát pre databázu
    updatedFields.avatar_url = avatarPath;
  }

  // ⛔ Ak nie sú žiadne zmeny, netreba robiť nič
  if (Object.keys(updatedFields).length === 0) {
    console.log("Žiadne zmeny sa nenašli, nič neupdatujem.");
    return;
  }

  // 💾 Uložime len zmenené polia
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        ...updatedFields,
      },
      { onConflict: "id" },
    )
    .single();

  if (error) {
    console.error("Chyba pri upserte profilu:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
}

// MARK: UPDATE USER
export async function updateUser(formData) {
  const supabase = await createClient();

  const newPassword = formData.get("newPassword");
  const re_newPassword = formData.get("re_newPassword");

  if (!newPassword) {
    return { error: "Heslo nemôže byť prázdne." };
  }

  if (newPassword.length < 6) {
    return { error: "Heslo musí mať aspoň 6 znakov." };
  }

  if (newPassword !== re_newPassword) {
    return { error: "Heslá sa nezhodujú." };
  }

  const { data: result, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Chyba pri zmene hesla:", error);

    // špeciálne ošetrenie pre neautorizovaného používateľa
    if (error.status === 401) {
      await supabase.auth.signOut();
      redirect("/login");
    }

    return { error: error.message };
  }

  if (!result.session) {
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
  }

  revalidatePath("/", "layout");
}

// MARK: ADMIN UPDATE PROFILES
export async function AdminUpdateProfilesData(formData) {
  const supabase = await createClient();

  const profileId = formData.get("id");

  // 🧾 Získanie aktuálneho profilu z databázy
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Chyba pri načítaní profilu:", profileError);
    return { error: "Nepodarilo sa načítať profil." };
  }

  const newData = {
    full_name: formData.get("full_name"),
    address: formData.get("address"),
    dateOfBirth: formData.get("dateOfBirth"),
    medCheckDate: formData.get("medCheckDate"),
    phone: formData.get("phone"),
  };

  // 🎯 Zistíme, ktoré polia sa skutočne zmenili
  const updatedFields = {};
  for (const key in newData) {
    if (newData[key] && newData[key] !== existingProfile?.[key]) {
      updatedFields[key] = newData[key];
    }
  }

  // ⛔ Ak nie sú žiadne zmeny, netreba robiť nič
  if (Object.keys(updatedFields).length === 0) {
    console.log("Žiadne zmeny sa nenašli, nič neupdatujem.");
    return;
  }

  // 💾 Uložime len zmenené polia
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: profileId,
        ...updatedFields,
      },
      { onConflict: "id" },
    )
    .single();

  if (error) {
    console.error("Chyba pri aktualizácii profilu:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
}

// MARK: CREATE NEW TASK
export async function createNewTask(formData) {
  const supabase = await createClient();

  const newTask = {
    title: formData.get("title"),
    dateFrom: formData.get("dateFrom"),
    dateTo: formData.get("dateTo") || formData.get("dateFrom"),
    startTime: formData.get("startTime") || null,
    endTime: formData.get("endTime") || null,
    note: formData.get("note")?.trim() || null,
    isAllDay: !!formData.get("isAllDay"),
  };

  const { error } = await supabase.from("tasks").insert(newTask);

  if (error) {
    console.error("Chyba pri vytvorení novej úlohy:", error);
    return null;
  }

  revalidatePath("/", "calendar");
  return { success: true };
}

// MARK: UPDATE TASK
export async function updateTask(formData) {
  const supabase = await createClient();

  const taskId = formData.get("id");

  const existingTask = await getTask(taskId);
  console.log("Existing task:", existingTask);

  const updatedTask = {
    title: formData.get("title")?.trim() || null,
    dateFrom: formData.get("dateFrom"),
    dateTo: formData.get("dateTo") || formData.get("dateFrom"),
    startTime: formData.get("startTime") || null,
    endTime: formData.get("endTime") || null,
    note: formData.get("note")?.trim() || null,
    isAllDay: !!formData.get("isAllDay"),
  };

  const { error } = await supabase
    .from("tasks")
    .update(updatedTask)
    .eq("id", taskId);

  if (error) {
    console.error("Chyba pri aktualizácii úlohy:", error);
    return null;
  }

  revalidatePath("/", "calendar");
  return { success: true };
}

// MARK: DELETE TASK
export async function deleteTask(id) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Chyba pri mazaní úlohy:", error);
    return null;
  }

  revalidatePath("/", "calendar");

  return { success: true };
}

// MARK: GET SHIFT FOR MONTH
export async function getShiftsForMonth({ year, month }) {
  const supabase = createClient();

  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDayDate = new Date(year, month, 0);
  const to = lastDayDate.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("shifts")
    .select("*, profiles!inner (full_name, order_index, avatar_url)")
    .gte("date", from)
    .lte("date", to)
    .order("order_index", { ascending: true, foreignTable: "profiles" })
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

// MARK: UPSER SHIFT
export async function upsertShift(userId, dateStr, type) {
  const supabase = await createClient();

  const { error } = await supabase.from("shifts").upsert(
    {
      user_id: userId,
      date: dateStr, // "YYYY-MM-DD"
      shift_type: type, // "D", "N", "X"…
    },
    { onConflict: "user_id,date" }, // ❶
  );

  if (error) {
    console.error("Chyba pri pridávaní/aktualizáci služby:", error);
    return null;
  }

  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: DELETE SHIFT
// export async function deleteShift(userId, dateStr) {
//   const supabase = await createClient();

//   const { error } = await supabase
//     .from("shifts")
//     .delete()
//     .match({ user_id: userId, date: dateStr });

//   if (error) {
//     console.error("Chyba pri mazaní služby:", error);
//     return null;
//   }
//   revalidatePath("/", "shifts");
//   return { success: true };
// }

// MARK: CLEAR SHIFT  (vynuluje len hornú smenu, požiadavka ostane)
export async function clearShift(userId, dateStr) {
  const supabase = await createClient();

  const { error } = await supabase.from("shifts").upsert(
    {
      user_id: userId,
      date: dateStr, // "YYYY-MM-DD"
      shift_type: null, // ← len toto nulujeme
    },
    { onConflict: "user_id,date" },
  );

  if (error) {
    console.error("clearShift:", error);
    throw error;
  }

  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: CLEAR MONTH - DELETE ALL SHIFTS FOR MONTH
export async function clearMonth(year, month) {
  const supabase = await createClient();

  // 1. deň v mesiaci (YYYY-MM-DD)
  const from = `${year}-${String(month).padStart(2, "0")}-01`;

  // exkluzívna horná hranica = 1. deň nasledujúceho mesiaca
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const toExclusive = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const { error } = await supabase
    .from("shifts")
    .update({ shift_type: null, request_type: null, request_hours: null }) // alebo ''
    .gte("date", from) // vrátane 1. dňa
    .lt("date", toExclusive); // < 1. deň ďalšieho mesiaca

  if (error) throw error;

  revalidatePath("/", "shifts");
}

// MARK: INSERT PROFILE IN TO ROSTER
export async function insertProfileInToRoster(userId) {
  const supabase = await createClient(); // createClient je synchrónny

  // 1. deň aktuálneho mesiaca  → YYYY-MM-01
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .slice(0, 10);

  const { error } = await supabase
    .from("shifts")
    .upsert(
      {
        user_id: userId,
        date: firstOfMonth, // istota, že patrí do práve otvoreného mesiaca
        shift_type: null, // povolené hodnotou '' a neporuší NOT NULL
      },
      { onConflict: "user_id,date" }, // ak riadok existuje → UPDATE nič nezmení
    )
    .throwOnError(); // vyhodí chybu namiesto tichého failu

  // ak upsert prešiel, data nepotrebujeme
  revalidatePath("/", "shifts"); // refetch tabuľku / SWR key
}

// MARK: DELETE PROFILE FROM ROSTER
export async function deleteProfileFromRoster(userId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("shifts")
    .delete()
    .match({ user_id: userId });

  if (error) {
    console.error("Chyba pri mazaní služby:", error);
    return null;
  }
  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: MOVE ARROW
export async function moveArrow({ userId, direction }) {
  const supabase = await createClient();

  const delta = direction === "up" ? -1 : 1;

  // 1️⃣ nájdi môj aktuálny index
  const { data: me } = await supabase
    .from("profiles")
    .select("order_index")
    .eq("id", userId)
    .single();

  if (!me) throw new Error("Profil nenájdený");

  const target = me.order_index + delta;

  // 2️⃣ nájdi človeka, ktorý má target index
  const { data: other } = await supabase
    .from("profiles")
    .select("id")
    .eq("order_index", target)
    .single();

  if (!other) return; // sme na kraji tabuľky – nič na swap

  // 3️⃣ prehoďte si čísla
  //    (dva UPDATE-y; pri pár desiatkach ľudí je to OK)
  await supabase
    .from("profiles")
    .update({ order_index: me.order_index })
    .eq("id", other.id);

  await supabase
    .from("profiles")
    .update({ order_index: target })
    .eq("id", userId);
}

// MARK: UPSERT REQUEST
export async function upsertRequest(userId, dateStr, reqType, hours) {
  const supabase = await createClient();

  const { error } = await supabase.from("shifts").upsert(
    {
      user_id: userId,
      date: dateStr,
      request_type: reqType,
      request_hours: hours,
    },
    { onConflict: "user_id,date" },
  );
  if (error) {
    console.error("Chyba pri pridávaní požiadavky:", error);
    return null;
  }
  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: CLEAR REQUEST
export async function clearRequest(userId, dateStr) {
  const supabase = await createClient();

  const { error } = await supabase.from("shifts").upsert(
    {
      user_id: userId,
      date: dateStr,
      request_type: null,
      request_hours: null,
    },
    { onConflict: "user_id,date" },
  );

  if (error) {
    console.error("clearRequest:", error);
    return null;
  }
  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: GENERATE ROSTER (MVP – jeden klik)
export async function generateRoster(m) {
  const supabase = await createClient();

  // 1) prvý deň zobrazeného mesiaca (bez UTC posunu)
  const now = new Date();
  const baseY = now.getFullYear();
  const baseM = now.getMonth(); // 0..11
  const totalM = baseM + Number(m || 0);
  const year = baseY + Math.floor(totalM / 12);
  const monthIdx = ((totalM % 12) + 12) % 12; // späť do 0..11
  const firstOfMonth = `${year}-${String(monthIdx + 1).padStart(2, "0")}-01`;

  // 2) profily (zoraď podľa order_index pre stabilitu)
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("order_index", { ascending: true });

  if (profErr) {
    console.error("Chyba pri načítaní profilov:", profErr);
    return { error: profErr.message };
  }

  // 3) existujúce riadky v shifts pre tento mesiac (kotva = 1. deň)
  const { data: existing, error: existErr } = await supabase
    .from("shifts")
    .select("user_id")
    .eq("date", firstOfMonth);

  if (existErr) {
    console.error("Chyba pri načítaní existujúcich služieb:", existErr);
    return { error: existErr.message };
  }

  // 4) rozdiel – len tí, čo ešte nemajú záznam
  const existingSet = new Set((existing ?? []).map((s) => s.user_id));
  const toUpsert = (profiles ?? [])
    .filter((p) => !existingSet.has(p.id))
    .map((p) => ({
      user_id: p.id,
      date: firstOfMonth,
      shift_type: null,
    }));

  if (toUpsert.length === 0) {
    revalidatePath("/", "shifts");
    return { success: true, inserted: 0, date: firstOfMonth };
  }

  // 5) bulk upsert (idempotentné pri UNIQUE (user_id, date))
  const { error } = await supabase
    .from("shifts")
    .upsert(toUpsert, { onConflict: "user_id,date" });

  if (error) {
    console.error("Chyba pri pridávaní služieb:", error);
    return { error: error.message };
  }

  revalidatePath("/", "shifts");
  return { success: true, inserted: toUpsert.length, date: firstOfMonth };
}

// MARK: GENERATE SHIFTS AUTO (JS + norma hodín + requestové X blokuje deň)
export async function generateShiftsAuto(m) {
  const supabase = await createClient();

  /* ========== 1) Dátumy a norma hodín ========== */
  const now = new Date();
  const totalM = now.getMonth() + Number(m || 0);
  const year = now.getFullYear() + Math.floor(totalM / 12);
  const month0 = ((totalM % 12) + 12) % 12; // 0..11
  const month = month0 + 1; // 1..12
  const pad = (n) => String(n).padStart(2, "0");
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${pad(month)}-${pad(lastDay)}`;

  const prevDateStr = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() - 1);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  };

  function countWorkdays(y, m) {
    let c = 0;
    const daysInMonth = new Date(y, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(y, m - 1, d).getDay(); // 0=Ne .. 6=So
      if (dow >= 1 && dow <= 5) c++;
    }
    return c;
  }
  const workdays = countWorkdays(year, month);
  const NORMA_FULL = workdays * 7.5;

  /* ========== 2) Roster → profily (len tí, čo sú v 1. dni mesiaca) ========== */
  const { data: rosterIdsRows, error: rosterIdsErr } = await supabase
    .from("shifts")
    .select("user_id")
    .eq("date", from);
  if (rosterIdsErr) return { error: rosterIdsErr.message };

  const rosterIds = Array.from(
    new Set((rosterIdsRows ?? []).map((r) => r.user_id).filter(Boolean)),
  );
  if (!rosterIds.length)
    return { error: "Roster je prázdny – vlož ľudí do 1. dňa mesiaca." };

  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, full_name, order_index")
    .in("id", rosterIds)
    .order("order_index", { ascending: true });
  if (profErr) return { error: profErr.message };
  if (!profiles?.length)
    return { error: "Nepodarilo sa načítať profily pre daný roster." };

  /* ========== 3) Mesačné smeny (shift_type + request_type) ========== */
  const { data: monthShifts, error: monthErr } = await supabase
    .from("shifts")
    .select("user_id, date, shift_type, request_type")
    .gte("date", from)
    .lte("date", to);
  if (monthErr) return { error: monthErr.message };

  const norm = (v) => (v == null ? null : String(v).trim().toUpperCase());

  const existType = new Map(); // date -> Map(userId -> "D"|"N"|"RD"|"PN"|"X"|null)
  const reqOnly = new Map(); // date -> Map(userId -> "D"|"N") from xN/xD
  const blockReq = new Map(); // date -> Set(userId) pre request_type === "X"
  const hasRow = new Map(); // `${date}#${user}` -> true

  for (const row of monthShifts ?? []) {
    const d = row.date;
    const u = row.user_id;
    const st = norm(row.shift_type);
    const rt = norm(row.request_type);

    if (!existType.has(d)) existType.set(d, new Map());
    existType.get(d).set(u, st || null);

    if (rt === "XD") {
      if (!reqOnly.has(d)) reqOnly.set(d, new Map());
      reqOnly.get(d).set(u, "N"); // xD -> len N
    } else if (rt === "XN") {
      if (!reqOnly.has(d)) reqOnly.set(d, new Map());
      reqOnly.get(d).set(u, "D"); // xN -> len D
    } else if (rt === "X") {
      if (!blockReq.has(d)) blockReq.set(d, new Set());
      blockReq.get(d).add(u); // requestové X = blok dňa
    }

    hasRow.set(`${d}#${u}`, true);
  }

  /* ========== 4) Pokrytie a targety ========== */
  const coverage = { N: 2, D: 2 }; // denne 2×N + 2×D
  const totalN = lastDay * coverage.N;
  const totalD = lastDay * coverage.D;

  function buildTargetsEqual(people, total) {
    const n = people.length;
    const base = Math.floor(total / n);
    let extra = total % n;
    const map = new Map();
    for (let i = 0; i < n; i++)
      map.set(people[i].id, base + (extra-- > 0 ? 1 : 0));
    return map;
  }
  const targetN = buildTargetsEqual(profiles, totalN);
  const targetD = buildTargetsEqual(profiles, totalD);

  const totalShiftsAll = totalN + totalD; // 4 * počet dní
  function buildTargetsEqualTotal(people, total) {
    const n = people.length;
    const base = Math.floor(total / n);
    let extra = total % n;
    const map = new Map();
    for (let i = 0; i < n; i++)
      map.set(people[i].id, base + (extra-- > 0 ? 1 : 0));
    return map;
  }
  const targetTotal = buildTargetsEqualTotal(profiles, totalShiftsAll);

  /* ========== 5) Stav medzi dňami, počítadlá a HODINY ========== */
  const dayState = new Map(); // userId -> { lastDate, lastType, consecSame }
  const dnCount = new Map(); // userId -> { D, N, total }
  const hoursCount = new Map(); // userId -> hours

  function getCounts(uid) {
    return dnCount.get(uid) || { D: 0, N: 0, total: 0 };
  }
  function incCount(uid, type) {
    const c = getCounts(uid);
    dnCount.set(uid, {
      ...c,
      [type]: (c[type] || 0) + 1,
      total: (c.total || 0) + 1,
    });
  }

  function getHours(uid) {
    return hoursCount.get(uid) || 0;
  }
  function incHours(uid, type) {
    const prev = getHours(uid);
    if (type === "D" || type === "N") hoursCount.set(uid, prev + 12);
    else if (type === "RD") hoursCount.set(uid, prev + 7.5);
    // PN/X/null = 0h
  }

  function remainingHours(uid) {
    return NORMA_FULL - getHours(uid); // kladné = chýba
  }
  function overHoursCap(uid, allowExceedBy12, anyUnderNorma) {
    if (!anyUnderNorma) return false; // keď už všetci >= norma, cap OFF
    const cap = NORMA_FULL + (allowExceedBy12 ? 12 : 0);
    return getHours(uid) >= cap;
  }

  function violatesDaywise(uid, type, dateStr) {
    const s = dayState.get(uid) || {
      lastDate: null,
      lastType: null,
      consecSame: 0,
    };
    if (!s.lastDate) return false;
    const wasYesterday = s.lastDate === prevDateStr(dateStr);
    if (wasYesterday && s.lastType === "N" && type === "D") return true; // D hneď po N nie
    if (wasYesterday && s.lastType === type && s.consecSame >= 2) return true; // max 2 rovnaké
    return false;
  }
  function pushDayState(uid, type, dateStr) {
    const s = dayState.get(uid) || {
      lastDate: null,
      lastType: null,
      consecSame: 0,
    };
    const wasYesterday = s.lastDate === prevDateStr(dateStr);
    const consecSame =
      wasYesterday && s.lastType === type ? s.consecSame + 1 : 1;
    dayState.set(uid, { lastDate: dateStr, lastType: type, consecSame });
  }

  function lcg(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function remainingToTarget(uid, type) {
    const c = getCounts(uid);
    const t = type === "N" ? targetN.get(uid) : targetD.get(uid);
    return (t || 0) - (c[type] || 0); // kladné = chýba
  }
  function remainingToTotal(uid) {
    const c = getCounts(uid);
    const t = targetTotal.get(uid) || 0;
    return t - (c.total || 0);
  }
  function overTypeCap(uid, type, allowExceedBy1) {
    const c = getCounts(uid);
    const t = type === "N" ? targetN.get(uid) : targetD.get(uid);
    const cap = (t || 0) + (allowExceedBy1 ? 1 : 0);
    return (c[type] || 0) >= cap;
  }
  function overTotalCap(uid, allowExceedBy1) {
    const c = getCounts(uid);
    const cap = (targetTotal.get(uid) || 0) + (allowExceedBy1 ? 1 : 0);
    return (c.total || 0) >= cap;
  }

  /* ========== 6) Výber kandidáta (rešpektuje aj requestové X) ========== */
  function pickCandidate(
    type,
    dateStr,
    dayProfiles,
    assignedToday,
    rnd,
    allowExceedBy1 = false,
    allowExceedHoursBy12 = false,
  ) {
    const existMap = existType.get(dateStr) || new Map();
    const onlyMap = reqOnly.get(dateStr) || new Map();
    const blockSet = blockReq.get(dateStr) || new Set();

    const anyUnderNorma = profiles.some((p) => remainingHours(p.id) > 0);

    const base = [];
    for (const p of dayProfiles) {
      const uid = p.id;
      if (assignedToday.has(uid)) continue;

      const st = norm(existMap.get(uid));
      if (st === "D" || st === "N" || st === "RD" || st === "PN" || st === "X")
        continue;
      if (blockSet.has(uid)) continue; // requestové X = blok

      const only = onlyMap.get(uid);
      if (only && only !== type) continue;

      if (violatesDaywise(uid, type, dateStr)) continue;

      if (overTypeCap(uid, type, allowExceedBy1)) continue;
      if (overTotalCap(uid, allowExceedBy1)) continue;
      if (overHoursCap(uid, allowExceedHoursBy12, anyUnderNorma)) continue;

      base.push(uid);
    }
    if (!base.length) return null;

    const withDef = base.map((uid) => ({
      uid,
      defType: remainingToTarget(uid, type),
      defTotal: remainingToTotal(uid),
      hDef: remainingHours(uid),
    }));

    const needHours = withDef.filter((x) => x.hDef > 0);
    let pool = needHours.length ? needHours : withDef;

    const maxDefType = Math.max(...pool.map((x) => x.defType));
    pool = pool.filter((x) => x.defType === maxDefType);

    const maxDefTotal = Math.max(...pool.map((x) => x.defTotal));
    pool = pool.filter((x) => x.defTotal === maxDefTotal);

    const maxHDef = Math.max(...pool.map((x) => x.hDef));
    pool = pool.filter((x) => x.hDef === maxHDef);

    const pick = shuffle(
      pool.map((x) => x.uid),
      rnd,
    )[0];
    return pick ?? null;
  }

  /* ========== 7) Generovanie ========== */
  const toInsert = [];
  const toUpdate = [];

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
    const rnd = lcg(year * 10000 + month * 100 + day);
    const dayProfiles = shuffle(profiles, rnd);

    const existMap = existType.get(dateStr) || new Map();
    const blockSet = blockReq.get(dateStr) || new Set();
    const assignedToday = new Set();
    const remaining = { N: coverage.N, D: coverage.D };

    // započítaj existujúce (aj hodiny) + blok z requestového X
    for (const p of dayProfiles) {
      const uid = p.id;
      const st = norm(existMap.get(uid));
      const blockedByRequest = blockSet.has(uid);

      if (st === "D" || st === "N") {
        if (remaining[st] > 0) remaining[st] -= 1;
        assignedToday.add(uid);
        pushDayState(uid, st, dateStr);
        incCount(uid, st);
        incHours(uid, st);
      } else if (st === "RD" || st === "PN" || st === "X" || blockedByRequest) {
        assignedToday.add(uid); // blokuje deň
        if (st) incHours(uid, st); // requestové "X" = 0h, nič nepripočítaj
      }
    }

    // doplň zvyšné sloty (striktne → target+1 → target+1 + hodinové +12)
    for (const type of ["N", "D"]) {
      const need = remaining[type];
      for (let k = 0; k < need; k++) {
        let uid =
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            false,
            false,
          ) ||
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            true,
            false,
          ) ||
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            true,
            true,
          );

        if (!uid) continue;

        assignedToday.add(uid);
        pushDayState(uid, type, dateStr);
        incCount(uid, type);
        incHours(uid, type);

        const key = `${dateStr}#${uid}`;
        if (hasRow.get(key)) {
          toUpdate.push({ user_id: uid, date: dateStr, shift_type: type });
        } else {
          toInsert.push({ user_id: uid, date: dateStr, shift_type: type });
          hasRow.set(key, true);
          if (!existType.has(dateStr)) existType.set(dateStr, new Map());
          existType.get(dateStr).set(uid, type);
        }
      }
    }
  }

  /* ========== 8) Zápis do DB ========== */
  if (toInsert.length) {
    const { error: insErr } = await supabase.from("shifts").insert(toInsert);
    if (insErr) {
      console.error("Insert shifts error:", insErr);
      return { error: insErr.message };
    }
  }

  if (toUpdate.length) {
    for (const row of toUpdate) {
      const { error: upErr } = await supabase
        .from("shifts")
        .update({ shift_type: row.shift_type })
        .eq("user_id", row.user_id)
        .eq("date", row.date)
        .is("shift_type", null); // update len ak je NULL
      if (upErr) {
        console.error("Update shift (null->type) error:", upErr, row);
        return { error: upErr.message };
      }
    }
  }

  revalidatePath("/", "shifts");
  return {
    ok: true,
    generated_new: toInsert.length + toUpdate.length,
    range: { from, to },
  };
}
