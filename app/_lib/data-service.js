import { createClient } from "@/utils/supabase/server";

// ✅ Tento súbor je čisto serverový → žiadne toastovanie!

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

export async function getAllProfiles() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Chyba pri načítaní všetkých profilov:", error);
    return [];
  }

  return profiles;
}

export async function deleteProfile({ id }) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Chyba pri mazaní profilu:", deleteError);
    return { error: "Profil sa nepodarilo vymazať." };
  }

  return { success: true };
}
