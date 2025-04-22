import Image from "next/image";
import { getAllProfiles } from "../_lib/data-service";

export default async function UserProfiles() {

    const profiles = await getAllProfiles();

    return (
        <main className="p-4 w-full px-10">
            <h1 className="text-2xl font-bold mb-8 text-center text-primary-700">Zoznam stanice RZP</h1>
            <ul className="space-y-2">
                {profiles.map((profile) => {
                    const blankAvatar =
                        "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

                    // Vyfiltruj len tie polia, ktoré chceš zobraziť
                    const filteredProfile = { ...profile };
                    delete filteredProfile.id;
                    delete filteredProfile.avatar_url;
                    delete filteredProfile.username;
                    delete filteredProfile.updated_at;

                    return (
                        <li
                            key={profile.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: `60px repeat(${Object.keys(filteredProfile).length}, 1fr)`
                            }}
                            className="border rounded-xl p-4 shadow-sm bg-white gap-6 items-center"
                        >
                            <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300">
                                <Image
                                    src={profile.avatar_url || blankAvatar}
                                    fill
                                    alt="Avatar"
                                    className="object-cover"
                                />
                            </div>
                            {Object.entries(filteredProfile).map(([key, value]) => (
                                <p key={key} className={`text-sm text-gray-600 ${key === "full_name" ? "font-bold" : ""}`}>
                                    {value}
                                </p>
                            ))}
                        </li>
                    );
                })}

            </ul>
        </main>
    );
}

