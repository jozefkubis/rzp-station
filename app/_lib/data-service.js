import { createClient } from "@/utils/supabase/server";

// ✅ Tento súbor je čisto serverový → žiadne toastovanie!

// MARK: GET USER
export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Chyba pri získavaní používateľa:", error);
    return null;
  }

  return user;
}

// MARK: GET PROFILES
export async function getProfilesData(email) {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Chyba pri načítaní profilu:", error);
    return null;
  }

  return profiles;
}

// MARK: GET PROFILE BY ID
export async function getProfile(id) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Chyba pri načítaní profilu:", error);
    return null;
  }

  return profile;
}

// MARK: GET AVATAR
export async function getAvatarUrl(email) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Chyba pri načítaní avatar URL:", error);
    return null;
  }

  return profile?.avatar_url || null;
}

// MARK: GET USERNAME
export async function getUsername(email) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Chyba pri načítaní používateľského mena:", error);
    return null;
  }

  return profile?.username || null;
}

// MARK: GET ALL PROFILES
export async function getAllProfiles() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Chyba pri načítaní všetkých profilov:", error);
    return [];
  }

  return profiles;
}

// MARK: GET ALL TASKS
export async function getTasks() {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase.from("tasks").select("*");

  if (error) {
    console.error("Chyba pri načítaní všetkých zadaní:", error);
    return [];
  }

  return tasks;
}

// MARK: GET TASK BY ID
export async function getTask(id) {
  const supabase = await createClient();

  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Chyba pri načítaní úlohy:", error);
    return null;
  }

  return task;
}

// MARK: CREATE TASK
export async function createTask(task) {
  const supabase = await createClient();

  const { data: newTask, error } = await supabase.from("tasks").insert(task);

  if (error) {
    console.error("Chyba pri vytvorení novej úlohy:", error);
    return null;
  }

  return newTask;
}

// MARK: UPDATE TASK
export async function updateTask(task) {
  const supabase = await createClient();

  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", task.id)
    .select("*")
    .single();

  if (error) {
    console.error("Chyba pri aktualizácii úlohy:", error);
    return null;
  }

  return updatedTask;
}

// MARK: DELETE TASK
// export async function deleteTask(id) {
//   const supabase = await createClient();

//   const { error } = await supabase.from("tasks").delete().eq("id", id);

//   if (error) {
//     console.error("Chyba pri mazaní úlohy:", error);
//     return null;
//   }

//   return true;
// }

// MARK: GET ALL SHIFTS
export default async function getAllShifts() {
  const supabase = await createClient();

  const { data: shifts, error } = await supabase
    .from("shifts")
    .select("*, profiles!shifts_user_id_fkey(*)");

  if (error) {
    console.error("Supabase error – shifts:", error);
    throw error;
  }

  return shifts;
}

// MARK: ADD SHIFT
export async function addShift() {
  const supabase = await createClient();

  const { data: newShift, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Chyba pri vytvorení novej služby:", error);
    throw error;
  }

  return newShift;
}

// MARK: GET SHIFT FOR TODAY
export async function getShiftForToday() {
  const supabase = await createClient();

  const { data: shifts, error } = await supabase
    .from("shifts")
    .select("*, profiles!shifts_user_id_fkey(*)")
    .eq("date", new Date().toISOString().slice(0, 10));

  if (error) {
    console.error("Supabase error – shifts:", error);
    throw error;
  }

  return shifts;
}

// MARK: GET SHIFT FOR TOMORROW
export async function getShiftForTomorrow() {
  const supabase = await createClient();

  const tomortow = new Date();
  tomortow.setDate(tomortow.getDate() + 1);
  const tomorrowIso = tomortow.toISOString().slice(0, 10);

  const { data: shifts, error } = await supabase
    .from("shifts")
    .select("*, profiles!shifts_user_id_fkey(*)")
    .eq("date", tomorrowIso);

  if (error) {
    console.error("Supabase error – shifts:", error);
    throw error;
  }

  return shifts;
}

// MARK: GET TASK FOR TODAY
export async function getTasksForToday() {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("dateFrom", new Date().toISOString().slice(0, 10));

  if (error) {
    console.error("Supabase error – tasks:", error);
    throw error;
  }

  return tasks;
}

// MARK: GET TASK FOR TOMORROW
export async function getTasksForTomorrow() {
  const supabase = await createClient();

  const tomortow = new Date();
  tomortow.setDate(tomortow.getDate() + 1);
  const tomorrowIso = tomortow.toISOString().slice(0, 10);

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("dateFrom", tomorrowIso);

  if (error) {
    console.error("Supabase error – tasks:", error);
    throw error;
  }

  return tasks;
}

// MARK: GET ALL SHIFTS FOR PROFILE
export async function getAllShiftsForProfile(profileId) {
  const supabase = await createClient();

  const { data: shifts, error } = await supabase
    .from("shifts")
    .select(
      `
  id,
  user_id,
  date,
  shift_type,
  request_type,
  request_hours,
  profiles:profiles!shifts_user_id_fkey (
    id,
    full_name,
    order_index,
    avatar_url
  )
`,
    )

    .eq("user_id", profileId);

  if (error) {
    console.error("Supabase error – shifts:", error);
    throw error;
  }

  return shifts;
}

// MARK: GET SHIFTS FOR PROFILE FOR YEAR
export async function getShiftsForProfileForYear(
  profileId,
  year = new Date().getFullYear(), // napr. 2025
) {
  const supabase = await createClient();

  /* 1️⃣  Rozsah roka – rovno ako stringy YYYY-MM-DD */
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  /* 2️⃣  Query */
  const { data: shifts, error } = await supabase
    .from("shifts")
    .select(
      `
  id,
  user_id,
  date,
  shift_type,
  request_type,
  request_hours,
  profiles:profiles!shifts_user_id_fkey (
    id,
    full_name,
    order_index,
    avatar_url
  )
`,
    )

    .eq("user_id", profileId)
    .gte("date", from)
    .lte("date", to);

  /* 3️⃣  Loguj len naozajstnú chybu */
  if (error) {
    console.error("Supabase error – shifts:", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    throw error; // nech sa dostane do errorBoundary, ak je vážna
  }

  return shifts ?? [];
}

// MARK: GET REQUEST_HOURS FOR PROFILE FOR MONTH
export async function getRequestHoursForMonth(monthOffset = 0) {
  const supabase = await createClient();

  /* 1️⃣  aktuálny používateľ */
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("No active session");

  /* 2️⃣  vypočítaj rozsah mesiaca podľa offsetu */
  const base = new Date();
  const target = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);

  const year = target.getFullYear();
  const month = target.getMonth() + 1; // 1-12

  const from = `${year}-${String(month).padStart(2, "0")}-01`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const toExclusive = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  /* 3️⃣  select všetkých request_hours v danom mesiaci */
  const { data, error } = await supabase
    .from("shifts")
    .select("request_hours")
    .eq("user_id", user.id)
    .gte("date", from)
    .lt("date", toExclusive);

  if (error) throw error;

  /* 4️⃣  súčet len z číselných hodnôt */
  return (data ?? []).reduce((sum, row) => {
    const n = Number(row.request_hours);
    return isNaN(n) ? sum : sum + n;
  }, 0);
}
