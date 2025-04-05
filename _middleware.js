import { NextResponse } from "next/server"
import { supabase } from "./app/_lib/supabase"


export async function middleware(req) {
    console.log('Request URL:', req.url)  // Logovanie požiadavky
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error('Chyba pri získavaní používateľa:', error.message)  // Logovanie chyby
    }

    console.log('User:', user)  // Logovanie používateľa, mal by byť alebo null, ak nie je prihlásený

    if (!user && !req.url.includes('/login')) {
        // Ak používateľ nie je prihlásený, presmerovať na login stránku
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/dashboard', '/account', '/chat', '/calendar', '/photos', '/documents'],  // Chránené cesty
}
