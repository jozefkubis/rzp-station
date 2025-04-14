// import getUserProfileData from "../_lib/data-service";
import { createClient } from '@/utils/supabase/server'


export default async function UserHeaderInfo() {

    const supabase = await createClient();

    // Získať aktuálneho používateľa
    const { data: user } = await supabase.auth.getUser();

    const userEmail = user.user.user_metadata.email
    const username = user.user.user_metadata.username

    // Získať profil používateľa na základe e-mailu
    // const profile = await getUserProfileData(userEmail);
    // console.log(profile);

    return (
        <>
            <p className="flex items-center gap-2 text-primary-700 font-semibold hover:bg-primary-100 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out">
                {user ? username : userEmail}
            </p>
        </>
    );
}
