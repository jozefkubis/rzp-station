"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import handleSubmitRegistration from "../_lib/functions/handleSubmitRegistration";
import Button from "./Button";
import FormInput from "./FormInput";
import Modal from "./Modal";
import SpinnerMini from "./SpinnerMini";
import WarningNotice from "./WarningNotice";

export default function RegisterForm({ admin }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const logo = "/logo.png";

  useEffect(() => {
    if (admin === "ÁNO" && error) toast.error(error);
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    startTransition(() => {
      handleSubmitRegistration(e, { setError, admin, setIsOpenModal });
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-h-screen-md mx-auto flex w-full flex-col justify-center overflow-auto rounded-lg px-6 py-8 sm:w-2/3 md:w-1/2 md:px-4 2xl:w-[40%]"
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
            required={admin === "ÁNO"}
            disabled={admin !== "ÁNO"}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            label="Heslo"
            id="password"
            type="password"
            placeholder="min. 6 znakov"
            name="password"
            required={admin === "ÁNO"}
            disabled={admin !== "ÁNO"}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            label="Potvrdenie hesla"
            id="re-password"
            type="password"
            placeholder="Potvrdenie hesla"
            name="re_password"
            required={admin === "ÁNO"}
            disabled={admin !== "ÁNO"}
          />
        </div>

        <div className="flex justify-end p-5">
          <Button
            variant="primary"
            size="large"
            disabled={isPending}
          >
            {isPending ? (
              <div className="inline-flex items-center gap-2">
                Registrujem
                <span>
                  <SpinnerMini />
                </span>
              </div>
            ) : (
              "Registrovať"
            )}
          </Button>
        </div>
      </form>

      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <WarningNotice />
        </Modal>
      )}
    </>
  );
}
