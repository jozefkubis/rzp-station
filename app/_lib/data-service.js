// import { createClient } from "@/utils/supabase/server";

// // ✅ Tento súbor je čisto serverový → žiadne toastovanie!

// // MARK: GET USER
// export async function getUser() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (error) {
//     console.error("Chyba pri získavaní používateľa:", error);
//     return null;
//   }

//   return user;
// }

// // MARK: GET PROFILES
// export async function getProfilesData(email) {
//   const supabase = await createClient();

//   const { data: profiles, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("email", email)
//     .maybeSingle();

//   if (error) {
//     console.error("Chyba pri načítaní profilu:", error);
//     return null;
//   }

//   return profiles ?? null;
// }

// // MARK: GET PROFILE BY ID
// export async function getProfile(id) {
//   const supabase = await createClient();

//   const { data: profile, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", id)
//     .maybeSingle();

//   if (error) {
//     console.error("Chyba pri načítaní profilu:", error);
//     return null;
//   }

//   // keď profil neexistuje, profile bude = null (a to je OK)
//   return profile ?? null;
// }

// // MARK: GET AVATAR
// export async function getAvatarUrl(email) {
//   const supabase = await createClient();

//   const { data: profile, error } = await supabase
//     .from("profiles")
//     .select("avatar_url")
//     .eq("email", email)
//     .maybeSingle();

//   if (error) {
//     console.error("Chyba pri načítaní avatar URL:", error);
//     return null;
//   }

//   return profile?.avatar_url || null;
// }

// // MARK: GET USERNAME
// export async function getUsername(email) {
//   const supabase = await createClient();

//   const { data: profile, error } = await supabase
//     .from("profiles")
//     .select("username")
//     .eq("email", email)
//     .maybeSingle();

//   if (error) {
//     console.error("Chyba pri načítaní používateľského mena:", error);
//     return null;
//   }

//   return profile?.username || null;
// }

// // MARK: GET ADMIN
// export async function getAdmin(email) {
//   const supabase = await createClient();

//   const { data: profile, error } = await supabase
//     .from("profiles")
//     .select("admin")
//     .eq("email", email)
//     .maybeSingle();

//   if (error) {
//     console.error("Chyba pri načítaní admina:", error);
//     return null;
//   }

//   return profile?.admin || null;
// }

// // MARK: GET ALL PROFILES
// export async function getAllProfiles() {
//   const supabase = await createClient();

//   const { data: profiles, error } = await supabase.from("profiles").select("*");

//   if (error) {
//     console.error("Chyba pri načítaní všetkých profilov:", error);
//     return [];
//   }

//   return profiles;
// }

// // MARK: GET ALL TASKS
// export async function getTasks() {
//   const supabase = await createClient();

//   const { data: tasks, error } = await supabase.from("tasks").select("*");

//   if (error) {
//     console.error("Chyba pri načítaní všetkých zadaní:", error);
//     return [];
//   }

//   return tasks;
// }

// // MARK: GET TASK BY ID
// export async function getTask(id) {
//   const supabase = await createClient();

//   const { data: task, error } = await supabase
//     .from("tasks")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.error("Chyba pri načítaní úlohy:", error);
//     return null;
//   }

//   return task;
// }

// // MARK: CREATE TASK
// export async function createTask(task) {
//   const supabase = await createClient();

//   const { data: newTask, error } = await supabase.from("tasks").insert(task);

//   if (error) {
//     console.error("Chyba pri vytvorení novej úlohy:", error);
//     return null;
//   }

//   return newTask;
// }

// // MARK: UPDATE TASK
// export async function updateTask(task) {
//   const supabase = await createClient();

//   const { data: updatedTask, error } = await supabase
//     .from("tasks")
//     .update(task)
//     .eq("id", task.id)
//     .select("*")
//     .single();

//   if (error) {
//     console.error("Chyba pri aktualizácii úlohy:", error);
//     return null;
//   }

//   return updatedTask;
// }

// // MARK: DELETE TASK
// // export async function deleteTask(id) {
// //   const supabase = await createClient();

// //   const { error } = await supabase.from("tasks").delete().eq("id", id);

// //   if (error) {
// //     console.error("Chyba pri mazaní úlohy:", error);
// //     return null;
// //   }

// //   return true;
// // }

// // MARK: GET ALL SHIFTS
// export default async function getAllShifts({ year, month } = {}) {
//   const supabase = await createClient();

//   const q = supabase
//     .from("shifts")
//     .select(
//       `
//       id,
//       user_id,
//       date,
//       inserted_at,
//       shift_type,
//       request_type,
//       request_hours,
//       profiles:profiles!shifts_user_id_fkey ( id, full_name, avatar_url )
//     `,
//     )
//     .order("order_index", { ascending: true })
//     .order("inserted_at", { ascending: true }) // stabilné poradie podľa vloženia
//     .order("id", { ascending: true }); // tie-breaker

//   if (year && month) {
//     const pad = (n) => String(n).padStart(2, "0");
//     const from = `${year}-${pad(month)}-01`;
//     const lastDay = new Date(year, month, 0).getDate();
//     const to = `${year}-${pad(month)}-${pad(lastDay)}`;
//     q.gte("date", from).lte("date", to); // 👈 filter mesiaca
//   }

//   const { data, error } = await q;
//   if (error) {
//     console.error("Supabase error – shifts:", error);
//     throw error;
//   }
//   return data ?? [];
// }

// // MARK: GET ALL SHIFTS FOR MONTH
// export async function getAllShiftsForMonth(m = 0) {
//   const supabase = await createClient();

//   // ========== 1) Spoľahlivý výpočet dátumov ==========
//   const now = new Date();
//   const totalM = now.getMonth() + Number(m || 0);
//   const year = now.getFullYear() + Math.floor(totalM / 12);
//   const month0 = ((totalM % 12) + 12) % 12; // 0..11
//   const month = month0 + 1; // 1..12

//   const pad = (n) => String(n).padStart(2, "0");
//   const from = `${year}-${pad(month)}-01`;
//   const lastDay = new Date(year, month, 0).getDate();
//   const to = `${year}-${pad(month)}-${pad(lastDay)}`;

//   // ========== 2) Query ==========
//   // app/_lib/data-service.js:243
//   const q = supabase
//     .from("shifts")
//     .select(
//       `
//       id,
//       user_id,
//       date,
//       order_index,
//       inserted_at,
//       shift_type,
//       request_type,
//       request_hours,
//       profiles:profiles!shifts_user_id_fkey ( id, full_name, position, avatar_url, contract )
//     `,
//     )
//     .order("order_index", { ascending: true })
//     .order("inserted_at", { ascending: true })
//     .order("id", { ascending: true })
//     .gte("date", from)
//     .lte("date", to);

//   const { data, error } = await q;
//   if (error) {
//     console.error("Supabase error – shifts:", error);
//     throw error;
//   }
//   return data ?? [];
// }

// // MARK: ADD SHIFT
// export async function addShift() {
//   const supabase = await createClient();

//   const { data: newShift, error } = await supabase
//     .from("shifts")
//     .select("*")
//     .eq("id", user.id)
//     .single();

//   if (error) {
//     console.error("Chyba pri vytvorení novej služby:", error);
//     throw error;
//   }

//   return newShift;
// }

// // MARK: GET SHIFT FOR TODAY
// export async function getShiftForToday() {
//   const supabase = await createClient();

//   const { data: shifts, error } = await supabase
//     .from("shifts")
//     .select("*, profiles!shifts_user_id_fkey(*)")
//     .eq("date", new Date().toISOString().slice(0, 10));

//   if (error) {
//     console.error("Supabase error – shifts:", error);
//     throw error;
//   }

//   return shifts;
// }

// // MARK: GET SHIFT FOR TOMORROW
// export async function getShiftForTomorrow() {
//   const supabase = await createClient();

//   const tomortow = new Date();
//   tomortow.setDate(tomortow.getDate() + 1);
//   const tomorrowIso = tomortow.toISOString().slice(0, 10);

//   const { data: shifts, error } = await supabase
//     .from("shifts")
//     .select("*, profiles!shifts_user_id_fkey(*)")
//     .eq("date", tomorrowIso);

//   if (error) {
//     console.error("Supabase error – shifts:", error);
//     throw error;
//   }

//   return shifts;
// }

// // MARK: GET TASKS FOR TODAY + TOMORROW
// export async function getTasksForTodayAndTomorrow() {
//   const supabase = await createClient();

//   // 1) pripravíme si today a tomorrow ako ISO dátumy (YYYY-MM-DD)
//   const today = new Date();
//   const tomorrow = new Date();
//   tomorrow.setDate(today.getDate() + 1);

//   const todayIso = today.toISOString().slice(0, 10);
//   const tomorrowIso = tomorrow.toISOString().slice(0, 10);

//   // 2) jeden dotaz na tasks v rozsahu today..tomorrow
//   const { data: tasks, error } = await supabase
//     .from("tasks")
//     // ak chceš, môžeš zúžiť výber len na potrebné stĺpce:
//     // .select("id, title, dateFrom, dateTo, startTime, endTime, note")
//     .select("*")
//     .gte("dateFrom", todayIso)
//     .lte("dateFrom", tomorrowIso);

//   if (error) {
//     console.error("Supabase error – tasks today+tomorrow:", error);
//     throw error;
//   }

//   // 3) roztriedime v JS na "dnes" a "zajtra"
//   const tasksForToday = tasks.filter((t) => t.dateFrom === todayIso);
//   const tasksForTmrw = tasks.filter((t) => t.dateFrom === tomorrowIso);

//   // 4) vrátime obe polia naraz
//   return { tasksForToday, tasksForTmrw };
// }

// // MARK: GET ALL SHIFTS FOR PROFILE
// export async function getAllShiftsForProfile(profileId) {
//   const supabase = await createClient();

//   const { data: shifts, error } = await supabase
//     .from("shifts")
//     .select(
//       `
//   id,
//   user_id,
//   date,
//   shift_type,
//   request_type,
//   request_hours,
//   profiles:profiles!shifts_user_id_fkey (
//     id,
//     full_name,
//     avatar_url
//   )
// `,
//     )

//     .eq("user_id", profileId);

//   if (error) {
//     console.error("Supabase error – shifts:", error);
//     throw error;
//   }

//   return shifts;
// }

// // MARK: GET SHIFTS FOR PROFILE FOR YEAR
// export async function getShiftsForProfileForYear(
//   profileId,
//   year = new Date().getFullYear(), // napr. 2025
// ) {
//   const supabase = await createClient();

//   /* 1️⃣  Rozsah roka – rovno ako stringy YYYY-MM-DD */
//   const from = `${year}-01-01`;
//   const to = `${year}-12-31`;

//   /* 2️⃣  Query */
//   const { data: shifts, error } = await supabase
//     .from("shifts")
//     .select(
//       `
//   id,
//   user_id,
//   date,
//   shift_type,
//   request_type,
//   request_hours,
//   profiles:profiles!shifts_user_id_fkey (
//     id,
//     full_name,
//     avatar_url
//   )
// `,
//     )

//     .eq("user_id", profileId)
//     .gte("date", from)
//     .lte("date", to);

//   /* 3️⃣  Loguj len naozajstnú chybu */
//   if (error) {
//     console.error("Supabase error – shifts:", {
//       code: error.code,
//       message: error.message,
//       details: error.details,
//     });
//     throw error; // nech sa dostane do errorBoundary, ak je vážna
//   }

//   return shifts ?? [];
// }

// // MARK: GET CONTRACT
// export async function getContract() {
//   const supabase = await createClient();

//   const { data: contract, error } = await supabase
//     .from("profiles")
//     .select("contract")
//     .single();

//   if (error) {
//     console.error("Supabase error – contract:", error);
//     throw error;
//   }

//   return contract;
// }

// // MARK: GET REQUEST_HOURS FOR PROFILE FOR MONTH
// // export async function getRequestHoursForMonth(monthOffset = 0) {
// //   const supabase = await createClient();

// //   /* 1️⃣  aktuálny používateľ */
// //   const {
// //     data: { user },
// //     error: userErr,
// //   } = await supabase.auth.getUser();
// //   if (userErr || !user) throw new Error("No active session");

// //   /* 2️⃣  vypočítaj rozsah mesiaca podľa offsetu */
// //   const base = new Date();
// //   const target = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);

// //   const year = target.getFullYear();
// //   const month = target.getMonth() + 1; // 1-12

// //   const from = `${year}-${String(month).padStart(2, "0")}-01`;

// //   const nextMonth = month === 12 ? 1 : month + 1;
// //   const nextYear = month === 12 ? year + 1 : year;
// //   const toExclusive = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

// //   /* 3️⃣  select všetkých request_hours v danom mesiaci */
// //   const { data, error } = await supabase
// //     .from("shifts")
// //     .select("request_hours")
// //     .eq("user_id", user.id)
// //     .gte("date", from)
// //     .lt("date", toExclusive);

// //   if (error) throw error;

// //   /* 4️⃣  súčet len z číselných hodnôt */
// //   return (data ?? []).reduce((sum, row) => {
// //     const n = Number(row.request_hours);
// //     return isNaN(n) ? sum : sum + n;
// //   }, 0);
// // }
