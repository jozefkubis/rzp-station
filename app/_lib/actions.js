"use server"

import { supabase } from "./supabase"

export async function logIn(formData) {
    const email = formData.get("email")
    const password = formData.get("password")

    console.log(email, password)

    if (!email || !password) {
        return { error: "Všetky polia sú povinné." }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function logOut() {
    await supabase.auth.signOut()
}

export async function register(formData) {
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
        return { error: "Všetky polia sú povinné." }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

