"use client";

import { generateShiftsAuto } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../Button";
import ShiftLoader from "./ShiftLoader";

export default function GenerateShifts() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const m = Number(searchParams.get("m") ?? 0);

  function handleClick() {
    if (isPending) return; // poistka proti dvojkliku

    startTransition(async () => {
      try {
        const res = await generateShiftsAuto(m);
        console.log("Výsledok generateShiftsAuto:", res);
      } catch (err) {
        console.error("Chyba pri generovaní služieb:", err);
      } finally {
        router.refresh();
      }
    });
  }

  return (
    isPending ? <ShiftLoader /> :
      <Button onClick={handleClick} disabled={isPending}>
        Generuj služby
      </Button>
  )
}
