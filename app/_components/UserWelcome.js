"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function UserWelcome() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const supabase = await createClient();
            const { data, error } = await supabase.auth.getUser();

            if (error || !data?.user) {
                console.log("no user");
            } else {
                setUser(data.user);
            }
        }
        getUser();
    }, []);


    return <p className="flex items-center gap-2 text-primary-700 font-semibold">{user?.email}</p>

}