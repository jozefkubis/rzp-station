import { createClient } from "@/utils/supabase/server";

export default async function UserHeaderInfo() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const email = user?.email

    return (
        <p className="text-sm font-semibold text-primary-700">
            {email}
        </p>
    );
}
