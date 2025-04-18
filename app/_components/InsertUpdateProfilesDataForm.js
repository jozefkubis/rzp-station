"use client"

import { useState } from "react"
import FormInput from "./FormInput"
import UpdateProfileButton from "./UpdateProfileButton"
import handleSubmitUploadProfileData from "../_lib/functions/handleSubmitUploadProfileData"
import ImageUploader from "./ImageUploader"

function InsertUpdateProfilesDataForm({ profiles, avatarUrl }) {
    const [error, setError] = useState("")
    const [full_name, setFull_name] = useState("")
    const [username, setUsername] = useState("")
    const [address, setAddress] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [avatar, setAvatar] = useState(null)


    function handleSubmit(e) {
        e.preventDefault()
        handleSubmitUploadProfileData(e, { setError, avatar })
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-8 space-y-6">
            <div className="flex flex-col">

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <FormInput
                    id="full_name"
                    type="text"
                    placeholder="Meno a priezvisko"
                    name="full_name"
                    onChange={(e) => setFull_name(e.target.value)}
                    value={full_name || profiles?.full_name}
                    {...(!profiles && { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="username"
                    type="text"
                    placeholder="Uživatelské meno"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username || profiles?.username}
                    {...(!profiles && { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="address"
                    type="text"
                    placeholder="Adresa"
                    name="address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address || profiles?.address}
                    {...(!profiles && { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="dateOfBirth"
                    type="date"
                    placeholder="Dátum narodenia"
                    name="dateOfBirth"
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    value={dateOfBirth || profiles?.dateOfBirth}
                    {...(!profiles && { required: true })}
                />
            </div>

            <ImageUploader onAvatarSelect={setAvatar} avatarUrl={avatarUrl} />

            <UpdateProfileButton />
        </form>
    )
}

export default InsertUpdateProfilesDataForm
