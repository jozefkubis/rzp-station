function ProfileIdInfo({ profileInfo }) {
    return (
        <>
            {profileInfo.map(({ title, value }) => (
                <div
                    key={title}
                    className="flex justify-between border-t border-gray-200 p-3 px-6"
                >
                    <h2 className="font-semibold">{title}</h2>
                    <p>{value}</p>
                </div>
            ))}
        </>
    )
}

export default ProfileIdInfo
