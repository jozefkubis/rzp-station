import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function UserHeaderInfo() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => { },
            },
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return <p className="text-gray-400">Neprihlásený</p>;
    }

    const username = user.user_metadata?.username;
    const email = user.email;

    return (
        <p className="text-sm font-semibold text-primary-700">
            {username || email}
        </p>
    );
}
