"use client";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import MyProfile from "./MyProfile";

export default function MyProfileWrapper({ profile, shifts, initialOffset }) {
  // 1️⃣ optimistický offset + setter
  const [optimOffset, setOptimOffset] = useOptimistic(
    initialOffset,
    (_, next) => next,
  );

  // 2️⃣ navigácia na pozadí
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function goTo(newOffset) {
    startTransition(() => {
      // 1️⃣  optimisticky posuň UI
      setOptimOffset(newOffset);

      // 2️⃣  a hneď v tom istom bloku spusti navigáciu
      router.push(`/?m=${newOffset}`);
    });
  }

  /* ---------- render ---------- */
  return (
    <>
      {/* samotná karta profilu */}
      <MyProfile
        profile={profile}
        shifts={shifts}
        offset={optimOffset} /* ← používa optimistickú hodnotu */
        goTo={goTo}
        disabled={isPending}
      />
    </>
  );
}
