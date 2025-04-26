import Image from "next/image";
import { getProfile } from "@/app/_lib/data-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const profile = await getProfile(params.profileId);

  if (!profile) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-500">
        Používateľ nenájdený.
      </div>
    );
  }

  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <Link
        href="/profiles"
        className="mb-6 ml-10 self-start font-semibold text-primary-700 hover:underline"
      >
        ← Späť na zoznam
      </Link>

      {/* <Link
        href={`/profiles/${params.profileId}/edit`}
        className="font-semibold text-blue-700 hover:underline"
      >
        ✏️ Upraviť profil
      </Link> */}

      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-gray-50 p-10 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary-300">
            <Image
              src={profile.avatar_url || blankAvatar}
              fill
              alt="Avatar"
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold text-primary-700">
            {profile.full_name}
          </h1>
          <p className="text-md text-gray-500">{profile.email}</p>
          <p className="text-md text-gray-500">
            {profile.phone ? `Tel.: ${profile.phone}` : "Telefón: ❔"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 text-sm text-gray-700 sm:grid-cols-2">
          <div>
            <h2 className="mb-1 font-semibold text-primary-600">Adresa</h2>
            <p>{profile.address || "❔"}</p>
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-primary-600">
              Dátum narodenia
            </h2>
            <p>{profile.dateOfBirth || "❔"}</p>
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-primary-600">
              Lekárska prehliadka
            </h2>
            <p>{profile.medCheckDate || "❔"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
