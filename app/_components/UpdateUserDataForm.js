"use client"

import { useState } from "react"
import FormInput from "./FormInput"
import UpdateUserButton from "./UpdateUserButton"
import handleSubmitUpdateUserData from "../_lib/functions/handleSubmitUpdateUserData"

function UpdateUserDataForm({ user }) {
    const [error, setError] = useState("")

    function handleSubmit(e) {
        handleSubmitUpdateUserData(e, { setError })
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-8 space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col">
                <FormInput
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    name="email"
                    disabled={true}
                    defaultValue={user?.email}
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="newPassword"
                    type="password"
                    placeholder="Vaše nové heslo"
                    name="newPassword"
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    id="re-newPassword"
                    type="password"
                    placeholder="Potvrdenie hesla"
                    name="re_newPassword"
                    required
                />
            </div>

            <UpdateUserButton />
        </form>
    )
}

export default UpdateUserDataForm
