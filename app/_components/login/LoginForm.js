"use client";

import LoginButton from "@/app/_components/login/LoginButton";
import LoginFormInput from "@/app/_components/login/LoginFormInput";
import handleSubmitLogin from "@/app/_lib/functions/handleSubmitLogin";
import useMedia from "@/app/_lib/hooks/useMedia";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [error, setError] = useState("");
  const logo = "/bg-logo-lightblue.png";
  const logoMobile = "/bg-logo-orange.png";

  const isMd = useMedia();

  const logoSrc = isMd ? logo : logoMobile;

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSubmit(e) {
    handleSubmitLogin(e, { setError });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[400px] space-y-6 rounded-lg p-8 md:bg-primary-100 md:bg-opacity-10"
      data-cy="login-form"
    >
      <div className="flex items-center justify-center rounded-full">
        <Image src={logoSrc} height={250} width={250} alt="RZP Logo" />
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
