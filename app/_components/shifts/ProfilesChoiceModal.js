"use client";

import { insertProfileInToRoster } from "@/app/_lib/actions";
import Button from "../Button";
import { startTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";

export default function ProfilesChoiceModal({
  profiles,
  setIsProfilesModalOpen,
}) {
  const router = useRouter();

  /* --- 1. useOptimistic nad CELÝM poľom --- */
  const [optimisticProfiles, apply] = useOptimistic(
    profiles, // pôvodné pole
    (current, action) => {
      if (action.type === "INSERT") {
        return [...current, action.profile]; // pridaj nový profil
      }
      return current; // default vetva
    },
  );

  /* --- 2. klik na meno --- */
  async function handleClick(id, full_name) {
    // a) okamžitý zápis
    startTransition(() =>
      apply({ type: "INSERT", profile: { id, full_name } }),
    );

    setIsProfilesModalOpen(false);

    // b) zápis do DB
    await insertProfileInToRoster(id);

    // c) refresh – zosynchronizuje cache/UI
    router.refresh();
  }

  /* --- 3. renderuj OPTIMISTICKÉ pole --- */
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {optimisticProfiles.length ? (
        optimisticProfiles.map(({ id, full_name }) => (
          <Button
            key={id}
            variant="secondary"
            size="small"
            onClick={() => handleClick(id, full_name)}
          >
            {full_name || "Neznámy záchranár"}
          </Button>
        ))
      ) : (
        <p className="text-md text-primary-700">
          Všetci záchranári sú už zahrnutí v&nbsp;službách!
        </p>
      )}
    </div>
  );
}
