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
    const supabase = createClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const image = formData.get("image");

    // Ak nie je obrázok, musíme sa uistiť, že používateľ môže pokračovať
    if (!email || !password || !name || !image) {
        return { error: "Všetky polia musia byť vyplnené." };
    }

    // Nahrávanie obrázka do Supabase storage
    const imageName = `${Date.now()}-${image.name}`.replace(/\s/g, "-");
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(imageName, image, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        console.error("Chyba pri nahrávaní obrázka:", uploadError);
        return { error: "Nepodarilo sa nahrať obrázok." };
    }

    // Získanie URL obrázka po nahraní
    const imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${imageName}`;

    // Vytvorenie používateľa v autentifikácii
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                avatar_url: imagePath, // Uložíme URL obrázka do profilu
            },
        },
    });

    if (error) {
        console.error("Chyba pri registrácii:", error);
        return { error: error.message };
    }

    // Presmerovanie po úspešnej registrácii
    revalidatePath("/", "layout");
    redirect("/");
}

