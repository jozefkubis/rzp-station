"use client";

import { generateShiftsAuto } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../Button";

export default function GenerateShifts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const m = Number(searchParams.get("m") ?? 0);

  async function handleClick() {
    try {
      const res = await generateShiftsAuto(m);
      console.log("Výsledok generateShiftsAuto:", res);

      // po úspechu refreshni UI
      router.refresh();
    } catch (err) {
      console.error("Chyba pri generovaní služieb:", err);
    }
  }

  return <Button onClick={handleClick}>Generuj služby</Button>;
}
