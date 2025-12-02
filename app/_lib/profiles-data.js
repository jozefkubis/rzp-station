// app/_lib/profiles-data.js
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
        .maybeSingle();

    if (error) {
        console.error("Chyba pri načítaní profilu:", error);
        return null;
    }

    return profiles ?? null;
}

// MARK: GET PROFILE BY ID
export async function getProfile(id) {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Chyba pri načítaní profilu:", error);
        return null;
    }

    return profile ?? null;
}

// MARK: GET AVATAR
export async function getAvatarUrl(email) {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("email", email)
        .maybeSingle();

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
        .maybeSingle();

    if (error) {
        console.error("Chyba pri načítaní používateľského mena:", error);
        return null;
    }

    return profile?.username || null;
}

// MARK: GET ADMIN
export async function getAdmin(email) {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("admin")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        console.error("Chyba pri načítaní admina:", error);
        return null;
    }

    return profile?.admin || null;
}

// MARK: GET ALL PROFILES
export async function getAllProfiles() {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

    if (error) {
        console.error("Chyba pri načítaní všetkých profilov:", error);
        return [];
    }

    return profiles;
}

// MARK: GET CONTRACT (z tabuľky profiles)
export async function getContract() {
    const supabase = await createClient();

    const { data: contract, error } = await supabase
        .from("profiles")
        .select("contract")
        .single();

    if (error) {
        console.error("Supabase error – contract:", error);
        throw error;
    }

    return contract;
}
