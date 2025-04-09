"use client"

import { useState } from "react"
import Image from "next/image"
import FormInput from "./FormInput"
import LoginButton from "./LoginButton"
import handleSubmitLogin from "../_lib/functions/handleSubmitLogin"

export default function LoginForm() {
  const [error, setError] = useState("")
  const logo = "/bg-logo-lightblue.png"


  function handleSubmit(e) {
    handleSubmitLogin(e, { setError })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        // action={login}
        className="w-full max-w-md rounded-lg p-8 space-y-6 bg-primary-100 bg-opacity-10 mx-auto"
      >
        <div className="flex items-center justify-center rounded-full">
          <Image src={logo} height={250} width={250} alt="RZP Logo" />
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

        <LoginButton />
      </form>
    </>
  )
}
