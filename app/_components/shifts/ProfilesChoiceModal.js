"use client";

import { insertProfileInToRoster } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation"; // 👈 pridaj
import { startTransition, useOptimistic } from "react";
import toast from "react-hot-toast";
import Button from "../Button";

export default function ProfilesChoiceModal({
  profiles,
  setIsProfilesModalOpen,
  onInsertEmptyShift,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const m = Number(searchParams.get("m") ?? 0); // 👈 offset mesiaca z URL

  const [optimisticProfiles, applyRemove] = useOptimistic(
    profiles,
    (current, action) =>
      action.type === "REMOVE"
        ? current.filter((p) => p.id !== action.id)
        : current,
  );

  async function handleClick(id, full_name) {
    startTransition(() => {
      applyRemove({ type: "REMOVE", id });
      onInsertEmptyShift({ userId: id, full_name });
    });

    setIsProfilesModalOpen(false);

    try {
      // 👇 teraz už posielame správny mesiac
      await insertProfileInToRoster(id, m);
      toast.success(`${full_name} zahrnutý do služieb`);
    } catch {
      toast.error("Nepodarilo sa pridať záchranára");
    } finally {
      router.refresh();
    }
  }

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
