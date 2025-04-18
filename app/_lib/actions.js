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

export async function InsertUpdateProfilesDataForm(formData) {
    const supabase = await createClient();

    // 🔐 Získame aktuálne prihláseného používateľa
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Nie je prihlásený používateľ", userError);
        redirect("/login");
        return;
    }

    // 🧾 Získanie aktuálneho profilu z databázy
    const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError && profileError.code !== "PGRST116") {
        console.error("Chyba pri načítaní profilu:", profileError);
        return { error: "Nepodarilo sa načítať profil." };
    }

    const newData = {
        full_name: formData.get("full_name"),
        username: formData.get("username"),
        address: formData.get("address"),
        dateOfBirth: formData.get("dateOfBirth"),
    };

    // 🎯 Zistíme, ktoré polia sa skutočne zmenili
    const updatedFields = {};
    for (const key in newData) {
        if (
            newData[key] &&
            newData[key] !== existingProfile?.[key]
        ) {
            updatedFields[key] = newData[key];
        }
    }

    // 🖼 Práca s obrázkom (avatar)
    let avatar = formData.get("avatar");

    if (avatar && avatar instanceof File) {
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

    // ⛔ Ak nie sú žiadne zmeny, netreba robiť nič
    if (Object.keys(updatedFields).length === 0) {
        console.log("Žiadne zmeny sa nenašli, nič neupdatujem.");
        return;
    }

    // 💾 Uložime len zmenené polia
    const { error } = await supabase
        .from("profiles")
        .upsert(
            {
                id: user.id,
                ...updatedFields,
            },
            { onConflict: "id" }
        )
        .single();

    if (error) {
        console.error("Chyba pri upserte profilu:", error);
        redirect("/error");
    }


    revalidatePath("/", "layout");
}

export async function updateUser(formData) {
    const supabase = await createClient()

    const newPassword = formData.get("newPassword")

    if (!newPassword) {
        return { error: "Heslo nemôže byť prázdne." }
    }

    const { data: result, error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        console.error("Chyba pri zmene hesla:", error)
        return { error: error.message }
    }

    if (!result.session) {
        await supabase.auth.signOut()
        revalidatePath("/", "layout")
        redirect("/login")
    }

    revalidatePath("/", "layout")
}

//https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//myPic.jpg