function ProfileContactInfo({ profile, contactInfo }) {
    return (
        <>
            {/* Meno */}
            <h1 className="text-base lg:text-2xl 2xl:text-3xl font-semibold text-primary-700 mt-4 mb:mt-6">
                {profile.full_name || "Meno neznáme"}
            </h1>

            {/* Telefón + e‑mail */}
            <div className="flex flex-col items-center gap-1 md:gap-2 text-primary-700">
                {contactInfo.map(({ label, value, icon }) => (
                    <div key={label} className="flex gap-2">
                        <p className="text-base lg:text-lg flex items-center gap-2 bg-quaternary-50 py-1 px-1 rounded-full">
                            {icon}
                        </p>
                        <p className="text-sm lg:text-lg flex items-center gap-2">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ProfileContactInfo
