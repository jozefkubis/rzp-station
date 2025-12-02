// app/_lib/shifts-data.js
import { createClient } from "@/utils/supabase/server";

// ✅ Shifts – všetko okolo služieb.

// MARK: GET ALL SHIFTS (s možným filtrom podľa roka/mesiaca)
export default async function getAllShifts({ year, month } = {}) {
    const supabase = await createClient();

    const q = supabase
        .from("shifts")
        .select(
            `
      id,
      user_id,
      date,
      inserted_at,
      shift_type,
      request_type,
      request_hours,
      profiles:profiles!shifts_user_id_fkey ( id, full_name, avatar_url )
    `
        )
        .order("order_index", { ascending: true })
        .order("inserted_at", { ascending: true })
        .order("id", { ascending: true });

    if (year && month) {
        const pad = (n) => String(n).padStart(2, "0");
        const from = `${year}-${pad(month)}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const to = `${year}-${pad(month)}-${pad(lastDay)}`;
        q.gte("date", from).lte("date", to);
    }

    const { data, error } = await q;
    if (error) {
        console.error("Supabase error – shifts:", error);
        throw error;
    }
    return data ?? [];
}

// MARK: GET ALL SHIFTS FOR MONTH (podľa offsetu m)
export async function getAllShiftsForMonth(m = 0) {
    const supabase = await createClient();

    const now = new Date();
    const totalM = now.getMonth() + Number(m || 0);
    const year = now.getFullYear() + Math.floor(totalM / 12);
    const month0 = ((totalM % 12) + 12) % 12; // 0..11
    const month = month0 + 1; // 1..12

    const pad = (n) => String(n).padStart(2, "0");
    const from = `${year}-${pad(month)}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${pad(month)}-${pad(lastDay)}`;

    const q = supabase
        .from("shifts")
        .select(
            `
      id,
      user_id,
      date,
      order_index,
      inserted_at,
      shift_type,
      request_type,
      request_hours,
      profiles:profiles!shifts_user_id_fkey ( id, full_name, position, avatar_url, contract )
    `
        )
        .order("order_index", { ascending: true })
        .order("inserted_at", { ascending: true })
        .order("id", { ascending: true })
        .gte("date", from)
        .lte("date", to);

    const { data, error } = await q;
    if (error) {
        console.error("Supabase error – shifts:", error);
        throw error;
    }
    return data ?? [];
}

// MARK: ADD SHIFT
// ⚠️ Toto je pravdepodobne bug – používa user.id, ale user tu nie je definovaný.
// V tejto session to necháme tak, len presunuté 1:1, a neskôr sa k tomu vrátime.
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
        avatar_url
      )
    `
        )
        .eq("user_id", profileId);

    if (error) {
        console.error("Supabase error – shifts:", error);
        throw error;
    }

    return shifts;
}

// MARK: GET SHIFTS FOR PROFILE FOR YEAR
export async function getShiftsForProfileForYear(
    profileId,
    year = new Date().getFullYear()
) {
    const supabase = await createClient();

    const from = `${year}-01-01`;
    const to = `${year}-12-31`;

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
        avatar_url
      )
    `
        )
        .eq("user_id", profileId)
        .gte("date", from)
        .lte("date", to);

    if (error) {
        console.error("Supabase error – shifts:", {
            code: error.code,
            message: error.message,
            details: error.details,
        });
        throw error;
    }

    return shifts ?? [];
}
