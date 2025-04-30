import { supabaseAdmin } from '@/utils/supabase/admin';
import { redirect } from 'next/dist/server/api-utils';

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response("Missing ID", { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
        console.error("Chyba pri mazaní používateľa:", error.message);
        return new Response("Mazanie zlyhalo", { status: 500 });
    }


    return new Response("Používateľ vymazaný", { status: 200 });
}
