"use client";

import { generateRoster } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../Button";

export default function GenerateRoster() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const m = Number(searchParams.get("m") ?? 0);

  async function handleClick() {
    try {
      // spustíme server action
      const res = await generateRoster(m);
      console.log("Výsledok:", res);

      // po úspechu refreshneme stránku
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("Chyba pri generovaní služieb:", err);
    }
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Pridávam..." : "Pridať záchranárov"}
    </Button>
  );
}
