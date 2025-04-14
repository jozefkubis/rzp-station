"use client"

import FormInput from "./FormInput"
import UpdateProfileButton from "./UpdateProfileButton"

function InsertUpdateProfilesDataForm() {



    return (
        <form className="w-full max-w-md rounded-lg p-8 space-y-6">
            <div className="flex flex-col">
                <FormInput
                    id="fullName"
                    type="text"
                    placeholder="Meno a priezvisko"
                    name="fullName"
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="address"
                    type="text"
                    placeholder="Adresa"
                    name="address"
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="dateOfBirth"
                    type="date"
                    placeholder="Dátum narodenia"
                    name="dateOfBirth"
                    required
                />
            </div>

            <UpdateProfileButton />
        </form>
    )
}

export default InsertUpdateProfilesDataForm
