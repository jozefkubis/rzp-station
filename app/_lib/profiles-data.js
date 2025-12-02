// app/_lib/profiles-data.js

import { getSupabaseServerClient, handleDbResult } from "./db";

// MARK: GET USER
export async function getUser() {
    const supabase = await getSupabaseServerClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    return handleDbResult({
        data: user ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET PROFILES (by email)
export async function getProfilesData(email) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    return handleDbResult({
        data: data ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET PROFILE BY ID
export async function getProfile(id) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    return handleDbResult({
        data: data ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET AVATAR
export async function getAvatarUrl(email) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("email", email)
        .maybeSingle();

    return handleDbResult({
        data: data?.avatar_url ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET USERNAME
export async function getUsername(email) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("email", email)
        .maybeSingle();

    return handleDbResult({
        data: data?.username ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET ADMIN
export async function getAdmin(email) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("admin")
        .eq("email", email)
        .maybeSingle();

    return handleDbResult({
        data: data?.admin ?? null,
        error,
        fallback: null,
    });
}

// MARK: GET ALL PROFILES
export async function getAllProfiles() {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*");

    return handleDbResult({
        data,
        error,
        fallback: [],
    });
}

// MARK: GET CONTRACT (z tabuľky profiles)
export async function getContract() {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("contract")
        .single();

    return handleDbResult({
        data,
        error,
        fallback: null,
    });
}
