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

  function handleClick() {
    if (isPending) return; // poistka proti dvojkliku

    startTransition(async () => {
      try {
        const res = await generateRoster(m);
        console.log("Výsledok generateRoster:", res);
      } catch (err) {
        console.error("Chyba pri generovaní služieb:", err);
      } finally {
        router.refresh();
      }
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Pridávam..." : "Pridať všetkých záchranárov"}
    </Button>
  );
}
