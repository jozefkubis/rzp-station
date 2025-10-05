import AdminUpdateProfilesDataForm from "@/app/_components/profiles/AdminUpdateProfilesDataForm";
import { getProfile, getUser } from "@/app/_lib/data-service";

export const dynamic = "force-dynamic"; // Ak treba

export default async function Page({ params }) {
  const { profileId } = await params;
  const user = await getUser();
  const userId = user?.id;

  if (!profileId) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-500">
        Chýba ID profilu.
      </div>
    );
  }

  const profile = await getProfile(profileId);

  if (!profile) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-red-500">
        Používateľ nenájdený.
      </div>
    );
  }

  return (
    <div>
      <AdminUpdateProfilesDataForm profile={profile} userId={userId} />
    </div>
  );
}
