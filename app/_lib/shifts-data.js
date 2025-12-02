import { getSupabaseServerClient, handleDbResult } from "./db";

// MARK: GET ALL SHIFTS (s možným filtrom podľa roka/mesiaca)
export default async function getAllShifts({ year, month } = {}) {
    const supabase = await getSupabaseServerClient();

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
    `,
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

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}

// MARK: GET ALL SHIFTS FOR MONTH (podľa offsetu m)
export async function getAllShiftsForMonth(m = 0) {
    const supabase = await getSupabaseServerClient();

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
    `,
        )
        .order("order_index", { ascending: true })
        .order("inserted_at", { ascending: true })
        .order("id", { ascending: true })
        .gte("date", from)
        .lte("date", to);

    const { data, error } = await q;

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}

// MARK: ADD SHIFT
// ⚠️ POZOR: stále platí, že tu je bug – používa user.id, ale user tu nie je definovaný.
// Zatiaľ len prehodené na nový klient 1:1, neskôr to spolu opravíme.
export async function addShift() {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("id", user.id)
        .single();

    return handleDbResult({
        data,
        error,
        fallback: null,
    });
}

// MARK: GET SHIFT FOR TODAY
export async function getShiftForToday() {
    const supabase = await getSupabaseServerClient();

    const todayIso = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from("shifts")
        .select("*, profiles!shifts_user_id_fkey(*)")
        .eq("date", todayIso);

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}

// MARK: GET SHIFT FOR TOMORROW
export async function getShiftForTomorrow() {
    const supabase = await getSupabaseServerClient();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from("shifts")
        .select("*, profiles!shifts_user_id_fkey(*)")
        .eq("date", tomorrowIso);

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}

// MARK: GET ALL SHIFTS FOR PROFILE
export async function getAllShiftsForProfile(profileId) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
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
    `,
        )
        .eq("user_id", profileId);

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}

// MARK: GET SHIFTS FOR PROFILE FOR YEAR
export async function getShiftsForProfileForYear(
    profileId,
    year = new Date().getFullYear(),
) {
    const supabase = await getSupabaseServerClient();

    const from = `${year}-01-01`;
    const to = `${year}-12-31`;

    const { data, error } = await supabase
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
    `,
        )
        .eq("user_id", profileId)
        .gte("date", from)
        .lte("date", to);

    return handleDbResult({
        data: data ?? [],
        error,
        fallback: [],
    });
}
