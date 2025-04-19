"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import handleSubmitRegistration from "../_lib/functions/handleSubmitRegistration"
import FormInput from "./FormInput"
import RegisterButton from "./RegisterButton"
import toast from "react-hot-toast"

export default function RegisterForm() {
    const [error, setError] = useState("")
    const logo = "/logo.png"

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    async function handleSubmit(e) {
        handleSubmitRegistration(e, { setError })
    }

    return (
        <div className="flex items-center justify-center min-h-screen gap-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg shadow-2xl p-8 space-y-6"
            >
                <div className="flex items-center justify-center">
                    <Image src={logo} height={150} width={150} alt="RZP Logo" />
                </div>

                <div className="flex flex-col">
                    <FormInput
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        name="email"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <FormInput
                        id="password"
                        type="password"
                        placeholder="Vaše heslo"
                        name="password"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <FormInput
                        id="re-password"
                        type="password"
                        placeholder="Potvrdenie hesla"
                        name="re_password"
                        required
                    />
                </div>
                <RegisterButton />
            </form>
        </div>
    )
}
