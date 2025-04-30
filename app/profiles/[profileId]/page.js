import Image from "next/image";
import { getProfile } from "@/app/_lib/data-service";
import Link from "next/link";
import Button from "@/app/_components/Button";
import { formatDate } from "@/app/_lib/helpers/functions";
import DeleteProfileButton from "@/app/_components/DeleteProfileButton";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { profileId } = await params;
  const profile = await getProfile(profileId);

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
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 items-center justify-center text-xl sm:grid-cols-2">
        <div className="flex flex-col items-center gap-10 px-10 border-r border-gray-200 mr-6 pr-1 h-2/3 justify-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary-300">
            <Image
              src={profile.avatar_url || blankAvatar}
              fill
              alt="Avatar"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 text-primary-700">
            <h1 className="text-2xl font-semibold">{profile.full_name}</h1>
            <p className="">{profile.email}</p>
            <p className="">
              {profile.phone ? `Tel.: ${profile.phone}` : "Telefón: ❔"}
            </p>
          </div>
        </div>

        <div className="flex sm:w-[500px] w-full flex-col text-primary-700 ml-6">
          <div className="flex justify-between gap-10 border-b border-t border-gray-200 p-3 px-6">
            <h2 className="font-semibold">Adresa:</h2>
            <p>{profile.address || "❔"}</p>
          </div>

          <div className="flex justify-between gap-10 border-b border-gray-200 p-3 px-6">
            <h2 className="font-semibold">Dátum narodenia:</h2>
            <p>{formatDate(profile.dateOfBirth) || "❔"}</p>
          </div>

          <div className="flex justify-between gap-10 p-3 px-6">
            <h2 className="font-semibold">Lekárska prehliadka:</h2>
            <p>{formatDate(profile.medCheckDate) || "❔"}</p>
          </div>

          <div className="flex flex-col gap-8 py-16 items-end">
            <div className="flex gap-8">
              <DeleteProfileButton profileId={profileId} />
              <Link
                href={`/profiles/${profileId}/edit`}
                className="font-semibold text-blue-700 hover:underline"
              >
                <Button variant="primary" size="medium">
                  ✏️ Upraviť profil
                </Button>
              </Link>
            </div>

            <div className="">
              <Link
                href="/profiles"
                className="font-semibold text-primary-700 hover:underline shadow-lg"
              >
                {/* <Button variant="secondary" size="medium"> */}
                ← Späť na zoznam
                {/* </Button> */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
