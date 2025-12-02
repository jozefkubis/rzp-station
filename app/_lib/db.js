import { createClient } from "@/utils/supabase/server";

// ✅ jednotné vytváranie Supabase klienta
export async function getSupabaseServerClient() {
    const supabase = await createClient();
    return supabase;
}

// ✅ jednotné spracovanie výsledku
export function handleDbResult({ data, error, fallback = null }) {
    if (error) {
        console.error("Supabase error:", error.message ?? error);
        throw new Error(error.message ?? "Database error");
    }

    // napr. pre SELECT * z tabulky
    if (data === null || data === undefined) return fallback;
    return data;
}
