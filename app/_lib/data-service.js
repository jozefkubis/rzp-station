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

export default async function getAllShifts() {
  const supabase = await createClient();

  const { data: shifts, error } = await supabase.from("shifts").select("*, profiles!shifts_user_id_fkey(full_name, avatar_url)");


  if (error) {
    console.error("Supabase error – shifts:", error);
    throw error;
  }

  return shifts;
}

