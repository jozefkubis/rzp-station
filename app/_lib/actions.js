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

  const { error } = await supabase
    .from("shifts")
    .upsert(
      {
        user_id: userId,
        date: dateStr,   // "YYYY-MM-DD"
        shift_type: null,   // ← len toto nulujeme
      },
      { onConflict: "user_id,date" }
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

  const { error } = await supabase
    .from("shifts")
    .upsert(
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
    { onConflict: "user_id,date" }
  );

  if (error) { console.error("clearRequest:", error); return null; }
  revalidatePath("/", "shifts");
  return { success: true };
}

