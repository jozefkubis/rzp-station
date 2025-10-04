"use client";

import Button from "@/app/_components/Button";
import FormInput from "@/app/_components/FormInput";
import handleSubmitUpdateUserData from "@/app/_lib/functions/handleSubmitUpdateUserData";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import SpinnerMini from "../SpinnerMini";

function UpdateUserDataForm({ user }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSubmit(e) {
    startTransition(() => {
      handleSubmitUpdateUserData(e, { setError });
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-screen w-1/2 flex-col justify-center rounded-lg p-8"
    >
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

      <div className="flex w-full justify-end py-10">
        <Button variant="primary" size="large">
          {isPending ? (
            <>
              Aktualizujem{" "}
              <span>
                {" "}
                <SpinnerMini />
              </span>
            </>
          ) : (
            "Aktualizovať heslo"
          )}
        </Button>
      </div>
    </form>
  );
}

export default UpdateUserDataForm;
