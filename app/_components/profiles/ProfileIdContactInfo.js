function ProfileContactInfo({ profile, contactInfo }) {
    return (
        <>
            {/* Meno */}
            <h1 className="text-2xl font-semibold text-primary-700 mt-6">
                {profile.full_name || "Meno neznáme"}
            </h1>

            {/* Telefón + e‑mail */}
            <div className="flex flex-col items-center gap-2 text-primary-700">
                {contactInfo.map(({ label, value, icon }) => (
                    <p key={label} className="text-lg flex items-center gap-2">
                        {icon} {value}
                    </p>
                ))}
            </div>
        </>
    )
}

export default ProfileContactInfo
