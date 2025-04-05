"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FormInput from "./FormInput"
import RegisterButton from "./RegisterButton"
import Image from "next/image"
import handleSubmitRegistration from "../_lib/functions/handleSubmitRegistration"

export default function RegisterForm() {
    const [error, setError] = useState("")
    const router = useRouter()
    const logo = "/logo.png"

    async function handleSubmit(e) {
        handleSubmitRegistration(e, { setError, router })
    }

    return (
        <div className="flex items-center justify-center min-h-screen gap-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg shadow-2xl p-8 space-y-6"
            >
                <div className="flex items-center justify-center">
                    <Image src={logo} height={200} width={200} alt="RZP Logo" />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col">
                    <FormInput
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        name="email"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <FormInput
                        label="Heslo"
                        id="password"
                        type="password"
                        placeholder="Vaše heslo"
                        name="password"
                        required
                    />
                </div>

                <RegisterButton />
            </form>
        </div>
    )
}
