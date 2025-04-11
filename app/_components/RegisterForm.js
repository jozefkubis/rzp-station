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
    const [image, setImage] = useState(null)
    const logo = "/logo.png"

    async function handleSubmit(e) {
        handleSubmitRegistration(e, { setError, router })
    }

    console.log("Form data image:", image);

    return (
        <div className="flex items-center justify-center min-h-screen gap-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg shadow-2xl p-8 space-y-6"
            >
                <div className="flex items-center justify-center">
                    <Image src={logo} height={150} width={150} alt="RZP Logo" />
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
                        label="Meno"
                        id="meno"
                        type="name"
                        placeholder="Meno alebo prezívka"
                        name="name"
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

                <div className="flex flex-col">
                    <FormInput
                        label="image"
                        id="image"
                        type="file"
                        placeholder="Pridaj obrázok"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                {image && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-700">Vybraný obrázok:</p>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="image preview"
                            className="w-24 h-24 object-cover mx-auto rounded-full"
                        />
                    </div>
                )}
                <RegisterButton />
            </form>
        </div>
    )
}
