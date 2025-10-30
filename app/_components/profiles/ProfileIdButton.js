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
    <Button onClick={handleClick} disabled={isPending} size="large">
      {isPending ? (
        <div className="inline-flex items-center gap-2">
          Smerujem
          <span>
            <SpinnerMini />
          </span>
        </div>
      ) : (
        "Upraviť profil"
      )}
    </Button>
  );
}
