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


