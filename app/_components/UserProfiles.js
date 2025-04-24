import Image from "next/image";
import DeleteProfileButton from "./DeleteProfileButton";

export default async function UserProfiles({ profiles }) {
  return (
    <main className="w-full px-20 pb-20">
      <h1 className="p-10 text-center text-2xl font-bold text-primary-700">
        Zoznam stanice RZP
      </h1>

      <ul className="space-y-4">
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
                gridTemplateColumns: `60px repeat(${
                  Object.keys(filteredProfile).length + 1
                }, 1fr)`,
              }}
              className="items-center gap-6 rounded-xl border bg-white p-4 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-primary-50"
            >
              {/* Avatar */}
              <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300">
                <Image
                  src={profile.avatar_url || blankAvatar}
                  fill
                  alt="Avatar"
                  className="object-cover"
                />
              </div>

              {/* Dynamické zobrazenie profilových údajov */}
              {Object.entries(filteredProfile).map(([key, value]) => (
                <p
                  key={key}
                  className={`text-sm text-gray-600 ${
                    key === "full_name" ? "font-bold" : ""
                  }`}
                >
                  {value || "❔"}
                </p>
              ))}
              <div className="flex justify-end">
                <DeleteProfileButton profileId={profile.id} />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
