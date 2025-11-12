import Image from "next/image"

function ProfileImage({ profile, blankAvatar }) {
    return (
        <div className="relative h-24 md:h-40 w-24 md:w-40 overflow-hidden rounded-full border-4 border-primary-300">
            <Image
                src={profile.avatar_url || blankAvatar}
                fill
                alt="Avatar"
                className="object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    )
}

export default ProfileImage
