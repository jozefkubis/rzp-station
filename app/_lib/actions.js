"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
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
    return;
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
    .select("*, profiles(full_name)")
    .gte("date", from)
    .lte("date", to)
    .order("full_name", { ascending: true, foreignTable: "profiles" })
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
export async function deleteShift(userId, dateStr) {
  const supabase = await createClient();

  console.log("[deleteShift]", userId, dateStr);

  const { error } = await supabase
    .from("shifts")
    .delete()
    .match({ user_id: userId, date: dateStr });

  if (error) {
    console.error("Chyba pri mazaní služby:", error);
    return null;
  }
  revalidatePath("/", "shifts");
  return { success: true };
}

// MARK: CLEAR MONTH - DELETE ALL SHIFTS FOR MONTH
export async function clearMonth(year, month) {
  const supabase = await createClient();

  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const to = new Date(year, month, 0).toISOString().slice(0, 10);

  const { error } = await supabase
    .from("shifts")
    .update({ shift_type: null })
    .gte("date", from)
    .lte("date", to);

  if (error) throw error;
}
