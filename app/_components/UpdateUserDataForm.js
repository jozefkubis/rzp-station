"use client"

import { useEffect, useState } from "react"
import FormInput from "./FormInput"
import UpdateUserButton from "./UpdateUserButton"
import handleSubmitUpdateUserData from "../_lib/functions/handleSubmitUpdateUserData"
import toast from "react-hot-toast"
import Button from "./Button"

function UpdateUserDataForm({ user }) {
    const [error, setError] = useState("")

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    function handleSubmit(e) {
        handleSubmitUpdateUserData(e, { setError })
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-lg p-8 flex flex-col justify-center h-screen w-2/3 mx-auto">

            <div className="flex flex-col">
                <FormInput
                    label="Email"
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
                    label="Nové heslo"
                    id="newPassword"
                    type="password"
                    placeholder="Vaše nové heslo"
                    name="newPassword"
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    label="Potvrdenie hesla"
                    id="re-newPassword"
                    type="password"
                    placeholder="Potvrdenie hesla"
                    name="re_newPassword"
                    required
                />
            </div>

            <div className="w-full flex justify-end py-10">
                <Button variant="primary" size="large">Aktualizovať heslo</Button>
            </div>
        </form>
    )
}

export default UpdateUserDataForm
