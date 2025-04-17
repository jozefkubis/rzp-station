'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()

    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function signup(formData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };


    const { data: result, error } = await supabase.auth.signUp(data);

    if (error) {
        console.error("Signup error:", error)
        redirect("/error")
    }


    if (!result.session) {
        revalidatePath("/", "layout")
        redirect("/verify-email")
    }

    revalidatePath("/", "layout")
    redirect("/")
}

export default async function InsertUpdateProfilesDataForm(formData) {
    const supabase = await createClient();

    // 🔐 Získame aktuálne prihláseného používateľa
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Nie je prihlásený používateľ", userError);
        redirect("/login"); // ⛔ Ak nie je používateľ, presmerujeme na login
        return;
    }

    // 🧾 Pripravíme si dáta z formulára
    const data = {
        id: user.id, // 🔑 Toto ID je zároveň primárny kľúč v profiles tabuľke
        full_name: formData.get("full_name"),
        username: formData.get("username"),
        address: formData.get("address"),
        dateOfBirth: formData.get("dateOfBirth"),
    };

    // 🖼 Práca s obrázkom (avatar)
    let avatar = formData.get("avatar");

    if (avatar && avatar instanceof File) {
        // 🧼 Upravíme názov súboru, aby bol bezpečný (odstránime medzery a pridáme timestamp)
        const avatarName = `${Date.now()}-${avatar.name}`.replace(/\s/g, "-");

        // ☁️ Upload obrázka do Supabase storage (bucket: "avatars")
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(avatarName, avatar, { cacheControl: "3600", upsert: true });

        if (uploadError) {
            console.error("Chyba pri nahrávaní obrázka:", uploadError);
            return { error: "Nepodarilo sa nahrať obrázok." };
        }

        // 🌐 Vytvorenie URL k nahratému obrázku (signovaná URL sa odporúča v prípade potreby autentifikácie)
        const avatarPath = `https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars/${avatarName}`;

        // 🔗 Pridáme URL obrázka do dát pre databázu
        data.avatar_url = avatarPath;
    }

    // 💾 Vloženie alebo aktualizácia profilu v databáze (ak záznam s daným ID existuje, updatne sa)
    const { error } = await supabase
        .from("profiles")
        .upsert(data, { onConflict: "id" }) // 🚀 "onConflict" zabezpečuje update pri existujúcom ID
        .single();

    if (error) {
        console.error("Signup error:", error);
        redirect("/error"); // ❌ V prípade chyby presmerujeme na error stránku
    }

    // 🔄 Revalidácia layoutu — ak používaš serverové komponenty s cachingom
    revalidatePath("/", "layout");
}

//https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//myPic.jpg