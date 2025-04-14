import { createClient } from '@/utils/supabase/server'

// export default async function getUserProfileData(email) {
//     const supabase = await createClient()

//     const { data: profiles, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq("email", email)
//         .single()

//     console.log(profiles);


//     if (error) {
//         console.error(error)
//         // throw new Error("Profily nie je možné načítať")
//     }

//     return profiles
// }
