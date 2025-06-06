"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LoginFormInput from "@/app/_components/login/LoginFormInput";
import LoginButton from "@/app/_components/login/LoginButton";
import handleSubmitLogin from "@/app/_lib/functions/handleSubmitLogin";
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
      className="mx-auto max-w-[400px] w-full space-y-6 rounded-lg bg-primary-100 bg-opacity-10 p-8"
      data-cy="login-form"
    >
      <div className="flex items-center justify-center rounded-full">
        <Image src={logo} height={250} width={250} alt="RZP Logo" />
      </div>

      <div className="flex flex-col">
        <LoginFormInput
          id="email"
          type="email"
          placeholder="example@email.com"
          name="email"
          required
        />
      </div>

      <div className="flex flex-col">
        <LoginFormInput
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
