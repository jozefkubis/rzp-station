"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import handleSubmitRegistration from "../_lib/functions/handleSubmitRegistration";
import FormInput from "./FormInput";
import toast from "react-hot-toast";
import Button from "./Button";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const logo = "/logo.png";

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  async function handleSubmit(e) {
    handleSubmitRegistration(e, { setError });
  }

  return (
    // <div className="flex h-screen items-center justify-center pb-20">
    <form
      data-cy="register-form"
      onSubmit={handleSubmit}
      className="mx-auto flex h-screen w-1/2 flex-col justify-center rounded-lg p-8"
    >
      {/* <div className="flex items-center justify-center">
          <Image src={logo} height={150} width={150} alt="RZP Logo" />
        </div> */}

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
          placeholder="min. 6 znakov"
          name="password"
          required
        />
      </div>

      <div className="flex flex-col">
        <FormInput
          label="Potvrdenie hesla"
          id="re-password"
          type="password"
          placeholder="Potvrdenie hesla"
          name="re_password"
          required
        />
      </div>

      <div className="flex justify-end p-5">
        <Button data-cy="register-button" variant="primary" size="large">
          Registrovať
        </Button>
      </div>
    </form>
    // </div>
  );
}
