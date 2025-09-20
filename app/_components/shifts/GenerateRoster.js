"use client";

import { copyRosterIfEmpty } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../Button";
import ShiftLoader from "./ShiftLoader";

export default function GenerateRoster() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const m = Number(searchParams.get("m") ?? 0);

  function handleClick() {
    if (isPending) return; // poistka proti dvojkliku

    startTransition(async () => {
      try {
        const res = await copyRosterIfEmpty(m);
        console.log("Výsledok generateRoster:", res);
      } catch (err) {
        console.error("Chyba pri generovaní služieb:", err);
      } finally {
        router.refresh();
      }
    });
  }

  return isPending ? (
    <ShiftLoader />
  ) : (
    <div>
      <Button onClick={handleClick} disabled={isPending}>
        Pridať všetkých záchranárov
      </Button>
    </div>
  );
}
