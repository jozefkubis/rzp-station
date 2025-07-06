"use client";

import { insertProfileInToRoster } from "@/app/_lib/actions";
import Button from "../Button";
import { startTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilesChoiceModal({
  profiles,
  setIsProfilesModalOpen,
  onInsertEmptyShift,
}) {
  const router = useRouter();

  /* 1️⃣  useOptimistic – odstránenie zo zoznamu voľných profilov */
  const [optimisticProfiles, applyRemove] = useOptimistic(
    profiles,
    (current, action) =>
      action.type === "REMOVE"
        ? current.filter((p) => p.id !== action.id)
        : current,
  );

  /* 2️⃣  klik na záchranára */
  async function handleClick(id, full_name) {
    /* A) dva optimistické zápisy v transition */
    startTransition(() => {
      applyRemove({ type: "REMOVE", id }); // modál: skryť
      onInsertEmptyShift({ userId: id, full_name }); // tabuľka: pridať rad
    });

    setIsProfilesModalOpen(false);

    try {
      /* B) zápis do DB */
      await insertProfileInToRoster(id);
      toast.success(`${full_name} zahrnutý do služieb`);
    } catch {
      toast.error("Nepodarilo sa pridať záchranára");
    } finally {
      /* C) refresh – potvrdí alebo rollbackne obidva optimizmy */
      router.refresh();
    }
  }

  /* 3️⃣  UI */
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
