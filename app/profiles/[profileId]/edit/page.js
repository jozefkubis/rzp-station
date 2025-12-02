import AdminUpdateProfilesDataForm from "@/app/_components/profiles/AdminUpdateProfilesDataForm";
import { getProfile, getUser } from "@/app/_lib/profiles-data";

export const dynamic = "force-dynamic"; // Ak treba

export default async function Page({ params }) {
  const { profileId } = await params;

  if (!profileId) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-500">
        Chýba ID profilu.
      </div>
    );
  }

  const [user, profile] = await Promise.all([getUser(), getProfile(profileId)]);
  const userId = user?.id;

  if (!profile) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-500">
        Používateľ nenájdený.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto flex h-screen items-center">
      <AdminUpdateProfilesDataForm profile={profile} userId={userId} />
    </div>
  );
}
