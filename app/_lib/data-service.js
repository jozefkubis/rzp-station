import { createClient } from '@/utils/supabase/server'
import toast from 'react-hot-toast';

export async function getUser() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user
}

export async function getProfilesData(email) {
    const supabase = await createClient()

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq("email", email)
        .single()

    if (error) {
        console.error(error)
        toast.error("Profily nie je možné načítať")
    }

    return profiles
}



export async function getAvatarUrl(email) {
    const supabase = await createClient()

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("email", email)
        .single();

    if (error) {
        console.error(error);
        toast.error("Profily nie je možné načítať");
    }

    const avatarUrl = profile?.avatar_url;

    return avatarUrl
}

export async function getUsername(email) {
    const supabase = await createClient()

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("email", email)
        .single();

    if (error) {
        console.error(error);
        toast.error("Profily nie je možné načítať");
    }

    const username = profile?.username;

    return username
}


