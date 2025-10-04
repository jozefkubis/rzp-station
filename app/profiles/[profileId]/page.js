import DeleteProfileButton from "@/app/_components/profiles/DeleteProfileButton";
import ProfileIdButton from "@/app/_components/profiles/ProfileIdButton";
import ProfileIdContactInfo from "@/app/_components/profiles/ProfileIdContactInfo";
import ProfileIdInfo from "@/app/_components/profiles/ProfileIdInfo";
import ProfileImage from "@/app/_components/profiles/ProfileImage";
import { getProfile } from "@/app/_lib/data-service";
import { formatDate } from "@/app/_lib/helpers/functions";
import Link from "next/link";
import { HiOutlineAtSymbol, HiOutlinePhone } from "react-icons/hi";

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

  function profileActions(profile) {
    return (
      <div className="flex flex-col items-end gap-8 pt-12">
        <div className="flex gap-2">
          <ProfileIdButton profile={profile} />
          <DeleteProfileButton profileId={profile.id} />
        </div>
        <Link
          data-cy="admin-back-to-profiles-button"
          href="/profiles"
          className="font-semibold text-primary-700 hover:underline"
        >
          ← Späť na zoznam
        </Link>
      </div>
    );
  }

  /** Telefón + e‑mail – vždy rovnaká štruktúra, takže si pomôžeme mapovaním */
  const contactInfo = [
    {
      label: "Telefón:",
      value: profile.phone || "-",
      icon: <HiOutlinePhone className="text-primary-700" />,
    },
    {
      label: "Email:",
      value: profile.email || "-",
      icon: <HiOutlineAtSymbol className="text-primary-700" />,
    },
  ];

  const profileInfo = [
    { title: "Číslo komory:", value: profile.body_number || "-" },
    { title: "Úväzok:", value: profile.contract || "-" },
    { title: "Pozícia:", value: profile.position || "-" },
    { title: "Adresa:", value: profile.address || "-" },
    {
      title: "Dátum narodenia:",
      value: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "-",
    },
    {
      title: "Lekárska prehliadka:",
      value: profile.medCheckDate ? formatDate(profile.medCheckDate) : "-",
    },
    {
      title: "Dátum psychotesty:",
      value: profile.psycho_check ? formatDate(profile.psycho_check) : "-",
    },
  ];

  return (
    <main className="flex min-h-screen bg-white p-10">
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center px-14 text-lg sm:grid-cols-2">
        {/* Ľavý stĺpec – avatar + kontakty */}
        <div className="flex h-screen flex-col items-center justify-center gap-2 border-r border-gray-200">
          <ProfileImage profile={profile} blankAvatar={blankAvatar} />
          <ProfileIdContactInfo profile={profile} contactInfo={contactInfo} />
        </div>

        {/* Pravý stĺpec – adresa a dátumy + akcie */}
        <div className="ml-6 flex flex-col justify-center text-primary-700">
          <ProfileIdInfo profileInfo={profileInfo} />
          {profileActions(profile)}
        </div>
      </div>
    </main>
  );
}
