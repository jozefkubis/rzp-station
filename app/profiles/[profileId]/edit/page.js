import Link from "next/link";
import { getProfile } from "@/app/_lib/data-service";
import AdminUpdateProfilesDataForm from "@/app/_components/AdminUpdateProfilesDataForm";

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
            <Link
                href={`/profiles/${profileId}`}
                className="mb-6 ml-10 self-start font-semibold text-primary-700 hover:underline"
            >
                ← Späť na profil
            </Link>
            <AdminUpdateProfilesDataForm profile={profile} />
        </div>
    );
}