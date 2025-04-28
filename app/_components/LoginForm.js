"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FormInput from "./FormInput";
import LoginButton from "./LoginButton";
import handleSubmitLogin from "../_lib/functions/handleSubmitLogin";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [error, setError] = useState("");
  const logo = "/bg-logo-lightblue.png";

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSubmit(e) {
    handleSubmitLogin(e, { setError });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-primary-100 bg-opacity-10 p-8"
    >
      <div className="flex items-center justify-center rounded-full">
        <Image src={logo} height={250} width={250} alt="RZP Logo" />
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

      <LoginButton />
    </form>
  );
}
