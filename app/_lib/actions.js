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
    body_number: formData.get("body_number"),
    address: formData.get("address"),
    dateOfBirth: formData.get("dateOfBirth"),
    medCheckDate: formData.get("medCheckDate"),
    psycho_check: formData.get("psycho_check"),
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
    body_number: formData.get("body_number"),
    dateOfBirth: formData.get("dateOfBirth"),
    medCheckDate: formData.get("medCheckDate"),
    psycho_check: formData.get("psycho_check"),
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
  const supabase = await createClient();

  const pad = (n) => String(n).padStart(2, "0");
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate(); // JS trik: m je 1..12 → vráti last day mes.
  const to = `${year}-${pad(month)}-${pad(lastDay)}`; // žiadne ISO

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

// MARK: CLEAR MONTH - DELETE ALL
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

// MARK: DELETE ONLY SHIFTS
export async function clearOnlyShifts(year, month) {
  const supabase = await createClient();

  // 1. deň v mesiaci (YYYY-MM-DD)
  const from = `${year}-${String(month).padStart(2, "0")}-01`;

  // exkluzívna horná hranica = 1. deň nasledujúceho mesiaca
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const toExclusive = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  // set shift_type = NULL len pre riadky, kde bolo D alebo N
  const { error } = await supabase
    .from("shifts")
    .update({ shift_type: null })
    .gte("date", from)
    .lt("date", toExclusive)
    .in("shift_type", ["D", "N", "DN", "ND", "vD", "vN", "zD", "zN"]); // ← filter na D/N

  if (error) throw error;

  revalidatePath("/", "shifts");
}

// MARK: INSERT PROFILE IN TO ROSTER
export async function insertProfileInToRoster(userId, m = 0) {
  const supabase = await createClient();

  // helper na čistý dátum string
  const ymd = (year, month1to12, day = 1) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${year}-${pad(month1to12)}-${pad(day)}`;
  };

  // výpočet roku/mesiaca podľa offsetu m
  const now = new Date();
  const totalM = now.getMonth() + Number(m || 0);
  const year = now.getFullYear() + Math.floor(totalM / 12);
  const month0 = ((totalM % 12) + 12) % 12; // 0..11
  const month = month0 + 1; // 1..12

  // 1. deň mesiaca (napr. "2025-08-01")
  const firstOfMonth = ymd(year, month, 1);

  // vlož seed riadok do shifts
  const { error } = await supabase.from("shifts").upsert(
    {
      user_id: userId,
      date: firstOfMonth,
      shift_type: null,
    },
    { onConflict: "user_id,date" }, // ak už existuje, nechá sa
  );

  if (error) throw error;

  // refresh tabuľky
  revalidatePath("/", "shifts");
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
    .select("id, full_name, contract")
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

// MARK: GENERATE SHIFTS AUTO
export async function generateShiftsAuto(m) {
  const supabase = await createClient();

  /* ========== 1) Dátumy ========== */
  const now = new Date();
  const intM = Number(m || 0);
  const totalM = now.getMonth() + intM; // posun voči aktuálnemu mesiacu
  const year = now.getFullYear() + Math.floor(totalM / 12);
  const month0 = ((totalM % 12) + 12) % 12; // 0..11
  const month = month0 + 1; // 1..12

  const pad = (n) => String(n).padStart(2, "0");

  // aktuálny mesiac
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate(); // JS: day=0 → posledný deň predošlého mesiaca
  const to = `${year}-${pad(month)}-${pad(lastDay)}`;

  // predchádzajúci mesiac
  const prevDate = new Date(year, month0 - 1, 1);
  const prevY = prevDate.getFullYear();
  const prevM0 = prevDate.getMonth(); // 0..11
  const prevM = prevM0 + 1; // 1..12
  const prevFrom = `${prevY}-${pad(prevM)}-01`;
  const prevLastDay = new Date(prevY, prevM, 0).getDate();
  const prevTo = `${prevY}-${pad(prevM)}-${pad(prevLastDay)}`;

  // helper na posun dňa o -1
  const prevDateStr = (dateStr) => {
    const [y, m2, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m2 - 1, d);
    dt.setDate(dt.getDate() - 1);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  };

  // --- norma hodín (pracovné dni × 7.5 h pre 1.0 úväzok) ---
  function countWorkdays(y, m1to12) {
    let c = 0;
    const daysInMonth = new Date(y, m1to12, 0).getDate();
    for (let d = 1;d <= daysInMonth;d++) {
      const dow = new Date(y, m1to12 - 1, d).getDay(); // 0=Ne..6=So
      if (dow >= 1 && dow <= 5) c++;
    }
    return c;
  }
  const workdays = countWorkdays(year, month);
  const NORMA_FULL = workdays * 7.5; // 1.0 úväzok

  // ========== 2) Roster pre mesiac – prehľadná verzia so Set-mi ==========

  async function selectUserIdsInRange(supabase, from, to) {
    const { data, error } = await supabase
      .from("shifts")
      .select("user_id")
      .gte("date", from)
      .lte("date", to);
    if (error) throw error;
    return (data ?? []).map((r) => r.user_id).filter(Boolean);
  }

  async function selectUserIdsOnDate(supabase, dateStr) {
    const { data, error } = await supabase
      .from("shifts")
      .select("user_id")
      .eq("date", dateStr);
    if (error) throw error;
    return (data ?? []).map((r) => r.user_id).filter(Boolean);
  }

  // 1) ID-čka v aktuálnom mesiaci
  const idsDay1This = new Set(await selectUserIdsOnDate(supabase, from));
  const idsAnyThis = new Set(await selectUserIdsInRange(supabase, from, to));
  const currIdsSet = new Set([...idsDay1This, ...idsAnyThis]);

  // 2) ID-čka v minulom mesiaci
  const idsDay1Prev = new Set(await selectUserIdsOnDate(supabase, prevFrom));
  const idsAnyPrev = new Set(
    await selectUserIdsInRange(supabase, prevFrom, prevTo),
  );
  const prevIdsSet = new Set([...idsDay1Prev, ...idsAnyPrev]);

  // 3) UNION: všetci z tohto ∪ minulého mesiaca
  const rosterIdsSet = new Set([...currIdsSet, ...prevIdsSet]);
  const rosterIds = Array.from(rosterIdsSet);

  // 4) Validácia
  if (rosterIds.length === 0) {
    return {
      error:
        "Roster je prázdny – pridaj záchranárov alebo vlož aspoň jednu požiadavku.",
    };
  }

  // 5) Seed 1. dňa pre tých, čo v tomto mesiaci ešte nemajú žiadny riadok
  const missingSeeds = [];
  for (const uid of rosterIds) {
    if (!currIdsSet.has(uid)) {
      missingSeeds.push({ user_id: uid, date: from, shift_type: null });
    }
  }

  if (missingSeeds.length > 0) {
    const { error: seedErr } = await supabase
      .from("shifts")
      .upsert(missingSeeds, { onConflict: "user_id,date" });
    if (seedErr) return { error: seedErr.message };
  }

  // ========== 3) Profily (s úväzkom!) ==========

  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, full_name, order_index, contract")
    .in("id", rosterIds)
    .order("order_index", { ascending: true });

  if (profErr) return { error: profErr.message };
  if (!profiles?.length)
    return { error: "Nepodarilo sa načítať profily pre daný roster." };

  // Mapujeme: user_id → contract (aspoň 1)
  const contractOf = new Map();
  for (const p of profiles) {
    const contractValue = Number(p.contract ?? 1);
    const safeValue = contractValue > 0 ? contractValue : 1;
    contractOf.set(p.id, safeValue);
  }

  // Funkcia na výpočet normy pre konkrétneho usera
  const personalNorm = (uid) => {
    const contract = contractOf.get(uid) ?? 1;
    return NORMA_FULL * contract;
  };

  /* ========== 4) Načítaj mesačné smeny/požiadavky ========== */
  const { data: monthShifts, error: monthErr } = await supabase
    .from("shifts")
    .select("user_id, date, shift_type, request_type") // ak nemáš request_type v shifts, zahoď tento stĺpec
    .gte("date", from)
    .lte("date", to);
  if (monthErr) return { error: monthErr.message };

  const norm = (v) => (v == null ? null : String(v).trim().toUpperCase());

  const existType = new Map(); // date -> Map(userId -> "D"|"N"|"RD"|"PN"|"X"|null)
  const reqOnly = new Map(); // date -> Map(userId -> "D"|"N") (z XD/XN)
  const blockReq = new Map(); // date -> Set(userId) pre request_type === "X"
  const hasRow = new Map(); // `${date}#${uid}`

  for (const row of monthShifts ?? []) {
    const d = row.date;
    const u = row.user_id;
    const st = norm(row.shift_type);
    const rt = norm(row.request_type);

    if (!existType.has(d)) existType.set(d, new Map());
    existType.get(d).set(u, st || null);

    if (rt === "XD") {
      if (!reqOnly.has(d)) reqOnly.set(d, new Map());
      reqOnly.get(d).set(u, "N");
    } else if (rt === "XN") {
      if (!reqOnly.has(d)) reqOnly.set(d, new Map());
      reqOnly.get(d).set(u, "D");
    } else if (rt === "X") {
      if (!blockReq.has(d)) blockReq.set(d, new Set());
      blockReq.get(d).add(u);
    }

    hasRow.set(`${d}#${u}`, true);
  }

  /* ========== 5) Pokrytie a VÁHOVÉ targety podľa úväzku ========== */
  const coverage = { N: 2, D: 2 }; // ← sem siahaš, keď chceš viac/menej smien denne
  const totalN = lastDay * coverage.N; // koľko N slotov mesačne
  const totalD = lastDay * coverage.D; // koľko D slotov mesačne

  // rozdelí 'total' položiek medzi 'people' podľa váhy (getWeight)
  function buildTargetsWeighted(people, total, getWeight) {
    const weights = people.map((p) => Math.max(0, Number(getWeight(p) ?? 0)));
    const sumW = weights.reduce((a, b) => a + b, 0);

    // ak nemáme váhy alebo total=0 → všetkým 0
    if (!sumW || total <= 0) return new Map(people.map((p) => [p.id, 0]));

    // 1) spočítaj “ideálny podiel” (môže byť desatinné číslo)
    const raw = people.map((p, i) => {
      const share = (total * weights[i]) / sumW; // ideálna časť z 'total'
      return {
        id: p.id,
        floor: Math.floor(share), // základ bez desatinnej časti
        frac: share - Math.floor(share), // zvyšok (0.. <1)
      };
    });

    // 2) koľko sme už pridelili cez floor a koľko ešte ostáva
    let assigned = raw.reduce((s, r) => s + r.floor, 0);
    let left = total - assigned;

    // 3) dorovnaj zvyšok tým, čo mali najväčšie zvyšky 'frac'
    raw.sort((a, b) => b.frac - a.frac); // zostupne podľa frac
    for (let i = 0;i < left;i++) raw[i].floor++;

    // výsledok: Map<userId, pocet>
    return new Map(raw.map((r) => [r.id, r.floor]));
  }

  // targety podľa úväzku (váha = p.contract, ak chýba tak 1)
  const targetN = buildTargetsWeighted(
    profiles,
    totalN,
    (p) => p.contract ?? 1,
  );
  const targetD = buildTargetsWeighted(
    profiles,
    totalD,
    (p) => p.contract ?? 1,
  );
  const targetTotal = buildTargetsWeighted(
    profiles,
    totalN + totalD,
    (p) => p.contract ?? 1,
  );

  /* ========== 6) Počítadlá a denné pravidlá ========== */
  const dayState = new Map(); // userId -> { lastDate, lastType, consecSame }
  const dnCount = new Map(); // userId -> { D, N, total }
  const hoursCount = new Map(); // userId -> number

  const getCounts = (uid) => dnCount.get(uid) || { D: 0, N: 0, total: 0 };
  const incCount = (uid, type) => {
    const c = getCounts(uid);
    dnCount.set(uid, {
      ...c,
      [type]: (c[type] || 0) + 1,
      total: (c.total || 0) + 1,
    });
  };

  const getHours = (uid) => hoursCount.get(uid) || 0;
  const incHours = (uid, type) => {
    const prev = getHours(uid);
    if (type === "D" || type === "N") hoursCount.set(uid, prev + 12);
    else if (type === "RD") hoursCount.set(uid, prev + 7.5);
  };

  const remainingHours = (uid) => personalNorm(uid) - getHours(uid);
  const anyUnderPersonalNorma = () =>
    profiles.some((p) => getHours(p.id) < personalNorm(p.id));
  const overHoursCap = (uid, allowExceedBy12) => {
    if (!anyUnderPersonalNorma()) return false;
    const cap = personalNorm(uid) + (allowExceedBy12 ? 12 : 0);
    return getHours(uid) >= cap;
  };

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

  // tvrdé: 1 alebo 2 dni voľno po N; + legacy: max 2 rovnaké po sebe, D po N včera zakázané
  function violatesDaywise(uid, type, dateStr) {
    const y1 = prevDateStr(dateStr);
    // const y2 = prevDateStr(y1);
    const getOn = (d) => {
      const m = existType.get(d);
      return norm(m ? m.get(uid) : null);
    };
    const t1 = getOn(y1);
    // const t2 = getOn(y2);
    if (t1 === "N") return true;
    // if (t1 === "N" || t2 === "N") return true;

    const s = dayState.get(uid) || {
      lastDate: null,
      lastType: null,
      consecSame: 0,
    };
    if (!s.lastDate) return false;

    const wasYesterday = s.lastDate === prevDateStr(dateStr);
    if (wasYesterday && s.lastType === "N" && type === "D") return true;
    if (wasYesterday && s.lastType === type && s.consecSame >= 2) return true;

    return false;
  }

  /* ========== 7) Helpery pre výber kandidáta ========== */
  function lcg(seed) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff;
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1;i > 0;i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const remainingToTarget = (uid, type) => {
    const c = getCounts(uid);
    const t = (type === "N" ? targetN.get(uid) : targetD.get(uid)) || 0;
    return t - (c[type] || 0);
  };
  const remainingToTotal = (uid) => {
    const c = getCounts(uid);
    const t = targetTotal.get(uid) || 0;
    return t - (c.total || 0);
  };
  const overTypeCap = (uid, type, allowExceedBy1) => {
    const c = getCounts(uid);
    const t = (type === "N" ? targetN.get(uid) : targetD.get(uid)) || 0;
    const cap = t + (allowExceedBy1 ? 1 : 0);
    return (c[type] || 0) >= cap;
  };
  const overTotalCap = (uid, allowExceedBy1) => {
    const c = getCounts(uid);
    const cap = (targetTotal.get(uid) || 0) + (allowExceedBy1 ? 1 : 0);
    return (c.total || 0) >= cap;
  };

  function getTypeOn(dateStr, uid) {
    const m = existType.get(dateStr);
    if (!m) return null;
    return m.get(uid) ?? null;
  }
  function shiftDaysAgo(dateStr, days) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() - days);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  }
  function patternTier(uid, type, dateStr) {
    const y1 = shiftDaysAgo(dateStr, 1);
    const y2 = shiftDaysAgo(dateStr, 2);
    const tY1 = getTypeOn(y1, uid);
    const tY2 = getTypeOn(y2, uid);

    const hadShiftY1 = tY1 === "D" || tY1 === "N";
    const hadShiftY2 = tY2 === "D" || tY2 === "N";

    if (type === "D" && !hadShiftY1 && !hadShiftY2) return 0; // D po 2 voľných
    if (type === "N" && tY1 === "D") return 0; // N po D

    if (tY2 === "N") return 2; // 2. deň po N – radšej voľno

    if (type === "N" && tY1 === "N") return 4; // fallback penalizácie
    if (type === "D" && tY1 === "D") return 4;

    return 1;
  }

  function pickCandidate(
    type,
    dateStr,
    dayProfiles,
    assignedToday,
    rnd,
    allowExceedBy1 = false,
    allowExceedHoursBy12 = false,
    strictCycle = true,
  ) {
    const existMap = existType.get(dateStr) || new Map();
    const onlyMap = reqOnly.get(dateStr) || new Map();
    const blockSet = blockReq.get(dateStr) || new Set();

    const base = [];
    for (const p of dayProfiles) {
      const uid = p.id;
      if (assignedToday.has(uid)) continue;

      const st = norm(existMap.get(uid));
      if (st === "D" || st === "N" || st === "RD" || st === "PN" || st === "X")
        continue;
      if (blockSet.has(uid)) continue;

      if (strictCycle) {
        const y1 = prevDateStr(dateStr);
        const mY1 = existType.get(y1);
        const tY1 = norm(mY1 ? mY1.get(uid) : null);
        if (tY1 === "D" && type === "D") continue;
      }

      const only = onlyMap.get(uid);
      if (only && only !== type) continue;

      if (violatesDaywise(uid, type, dateStr)) continue;
      if (overTypeCap(uid, type, allowExceedBy1)) continue;
      if (overTotalCap(uid, allowExceedBy1)) continue;
      if (overHoursCap(uid, allowExceedHoursBy12)) continue;

      base.push(uid);
    }
    if (!base.length) return null;

    const withTier = base.map((uid) => ({
      uid,
      tier: patternTier(uid, type, dateStr),
    }));
    const bestTier = Math.min(...withTier.map((x) => x.tier));
    let pool = withTier.filter((x) => x.tier === bestTier).map((x) => x.uid);

    let poolWithDef = pool.map((uid) => ({
      uid,
      defType: remainingToTarget(uid, type),
      defTotal: remainingToTotal(uid),
      hDef: remainingHours(uid),
    }));
    const needHours = poolWithDef.filter((x) => x.hDef > 0);
    poolWithDef = needHours.length ? needHours : poolWithDef;

    const maxDefType = Math.max(...poolWithDef.map((x) => x.defType));
    poolWithDef = poolWithDef.filter((x) => x.defType === maxDefType);

    const maxDefTotal = Math.max(...poolWithDef.map((x) => x.defTotal));
    poolWithDef = poolWithDef.filter((x) => x.defTotal === maxDefTotal);

    const maxHDef = Math.max(...poolWithDef.map((x) => x.hDef));
    poolWithDef = poolWithDef.filter((x) => x.hDef === maxHDef);

    const pick = shuffle(
      poolWithDef.map((x) => x.uid),
      rnd,
    )[0];
    return pick ?? null;
  }

  /* ========== 8) Generovanie ========== */
  const toInsert = [];
  const toUpdate = [];

  for (let day = 1;day <= lastDay;day++) {
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
    const rnd = lcg(year * 10000 + month * 100 + day);
    const dayProfiles = shuffle(profiles, rnd);

    const existMap = existType.get(dateStr) || new Map();
    const blockSet = blockReq.get(dateStr) || new Set();
    const assignedToday = new Set();
    const remaining = { N: coverage.N, D: coverage.D };

    // zarátať existujúce (aj hodiny) + blok z X
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
        if (st) incHours(uid, st);
      }
    }

    // doplň zvyšné sloty: striktne → striktne(+1) → uvoľnený cyklus → uvoľnený cyklus +12h
    for (const type of ["D", "N"]) {
      const need = remaining[type];
      for (let k = 0;k < need;k++) {
        const uid =
          // 1) striktne: žiadne D->D, bez prečerpania
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            false,
            false,
            true,
          ) ||
          // 2) striktne: žiadne D->D, povoliť +1 na targetoch
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            true,
            false,
            true,
          ) ||
          // 3) fallback: povoliť už aj D->D, stále bez hodinového +12
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            true,
            false,
            false,
          ) ||
          // 4) posledný fallback: povoliť aj hodinové +12
          pickCandidate(
            type,
            dateStr,
            dayProfiles,
            assignedToday,
            rnd,
            true,
            true,
            false,
          );

        if (!uid) continue;

        assignedToday.add(uid);
        pushDayState(uid, type, dateStr);
        incCount(uid, type);
        incHours(uid, type);

        // aktualizuj lokálnu mapu, aby ďalšie rozhodnutia brali túto zmenu do úvahy
        if (!existType.has(dateStr)) existType.set(dateStr, new Map());
        existType.get(dateStr).set(uid, type);

        const key = `${dateStr}#${uid}`;
        if (hasRow.get(key)) {
          // už riadok existuje → UPDATE (len ak je teraz null)
          toUpdate.push({ user_id: uid, date: dateStr, shift_type: type });
        } else {
          // nový riadok → INSERT
          toInsert.push({ user_id: uid, date: dateStr, shift_type: type });
          hasRow.set(key, true);
        }
      }
    }
  }

  /* ========== 9) Zápis do DB ========== */
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
        .is("shift_type", null); // len null → type (idempotentné)
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

// MARK: VALIDATE SHIFTS (pokrytie dňa + základné porušenia pravidiel)
export async function validateShifts(m = 0) {
  const supabase = await createClient();

  // ==== dátumové helpery (rovnaká logika ako v generateShiftsAuto) ====
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
    const [y, m2, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m2 - 1, d);
    dt.setDate(dt.getDate() - 1);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  };

  const labelSK = (t) => (t === "D" ? "Denná" : t === "N" ? "Nočná" : t);

  // ==== definuj požadované pokrytie na deň ====
  const coverage = { D: 2, N: 2 }; // uprav podľa potreby

  // ==== načítaj všetky služby v mesiaci (iba to, čo treba) ====
  const { data, error } = await supabase
    .from("shifts")
    .select("user_id, date, shift_type")
    .gte("date", from)
    .lte("date", to);

  if (error) {
    console.error("validateShifts: DB error", error);
    return { error: error.message };
  }

  // ==== spoločná normalizácia typov (rovnaká ako v generate) ====
  function norm(t) {
    if (t == null) return null;
    const s = String(t).trim().toUpperCase();
    if (s === "ZD" || s === "VD") return "D";
    if (s === "ZN" || s === "VN") return "N";
    return s; // "D","N","RD","PN","X", ...
  }

  // ==== indexy: per-day a per-date->user ====
  const byDate = new Map(); // date -> { D:Set<uid>, N:Set<uid>, ANY:Set<uid> }
  const existType = new Map(); // date -> Map(uid -> "D"|"N"|null)

  for (let day = 1;day <= lastDay;day++) {
    const d = `${year}-${pad(month)}-${pad(day)}`;
    byDate.set(d, { D: new Set(), N: new Set(), ANY: new Set() });
    existType.set(d, new Map());
  }

  for (const row of data ?? []) {
    const d = row.date;
    if (!byDate.has(d)) continue;

    const t = norm(row.shift_type); // ❗️teraz sa zD/zN zmení na D/N
    const uid = row.user_id;

    if (!existType.has(d)) existType.set(d, new Map());
    existType.get(d).set(uid, t || null);

    if (t === "D" || t === "N") {
      byDate.get(d)[t].add(uid);
      byDate.get(d).ANY.add(uid);
    }
  }

  // ==== helper na pravidlá (ak budeš chcieť použiť) ====
  const hasNightWithin2Days = (uid, dateStr) => {
    const d1 = prevDateStr(dateStr);
    const d2 = prevDateStr(d1);
    const m1 = existType.get(d1);
    const m2 = existType.get(d2);
    const t1 = m1 ? norm(m1.get(uid)) : null;
    const t2 = m2 ? norm(m2.get(uid)) : null;
    return t1 === "N" || t2 === "N";
  };

  // ==== validácia po dňoch ====
  const days = [];
  let totalIssues = 0;

  for (let day = 1;day <= lastDay;day++) {
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
    const rec = byDate.get(dateStr);
    const countD = rec.D.size;
    const countN = rec.N.size;
    const issues = [];

    // Pokrytie – nedostatok/nadbytok
    for (const type of ["D", "N"]) {
      const have = type === "D" ? countD : countN;
      const need = coverage[type];

      if (have < need) {
        const missing = need - have;
        issues.push({
          level: "error",
          code: "UNDER_COVERAGE",
          message: `chýba ${missing} × ${labelSK(type)}.`,
          meta: { type, need, have, missing },
        });
      } else if (have > need) {
        const extra = have - need;
        issues.push({
          level: "warn",
          code: "OVER_COVERAGE",
          message: `${extra} × ${labelSK(type)} naviac.`,
          meta: { type, need, have, extra },
        });
      }
    }

    totalIssues += issues.length;
    days.push({
      date: dateStr,
      counts: { D: countD, N: countN },
      coverage,
      issues,
    });
  }

  const hasErrors = days.some((d) => d.issues.some((i) => i.level === "error"));
  return {
    ok: true,
    range: { from, to },
    days,
    summary: {
      hasErrors,
      totalIssues,
    },
  };
}
