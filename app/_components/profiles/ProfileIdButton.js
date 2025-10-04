"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Button from "../Button";
import SpinnerMini from "../SpinnerMini";

export default function ProfileIdButton({ profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      router.push(`/profiles/${profile.id}/edit`);
    });
  }

  return (
    <Button onClick={handleClick}>
      {" "}
      {isPending ? (
        <>
          Smerujem{" "}
          <span>
            {" "}
            <SpinnerMini />
          </span>
        </>
      ) : (
        "Upraviť profil"
      )}
    </Button>
  );
}
