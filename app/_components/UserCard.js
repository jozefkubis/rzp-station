import Image from "next/image";

export default function UserCard({ profile, onClick }) {
    const blankAvatar = "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

    return (
        <li
            onClick={onClick}
            className="flex flex-col items-center gap-10 rounded-xl border bg-gray-50 px-8 py-12 shadow-md transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95 cursor-pointer"
        >
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full transition border-4 border-primary-300">
                <Image
                    src={profile.avatar_url || blankAvatar}
                    fill
                    alt="Avatar"
                    className="object-cover transition-transform hover:scale-105"
                />
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold text-primary-700 hover:underline">
                    {profile.full_name}
                </h1>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <p className="text-sm text-gray-500">
                    <span>Tel.: </span>
                    {profile.phone || "❔"}
                </p>
            </div>
        </li>
    );
}
