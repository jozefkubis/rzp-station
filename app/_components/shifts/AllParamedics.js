"use client";

import { deleteProfileFromRoster } from "@/app/_lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDelete from "../ConfirmDelete";
import Modal from "../Modal";
import WarningNotice from "../WarningNotice";

export default function AllParamedics({
  children,
  user,
  onDeleteOptimistic,
  roster,
  position,
  rowBg,
  admin,
}) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  /* 1️⃣ aktuálny offset z URL (server‑safe) */
  const urlOffset = searchParams.get("m") ?? "0";

  function handleClick() {
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    // A) okamžitý optimistický update (riadok zmizne hneď)

    startTransition(() => onDeleteOptimistic(user.user_id));
    setIsDeleting(true);

    try {
      // B) skutočný DELETE na serveri
      await deleteProfileFromRoster(user.user_id, urlOffset);

      // C) spätná väzba pre používateľa
      toast.success(`${user.full_name ?? "Záchranár"} odstránený zo služieb`);
    } catch (err) {
      toast.error("Nepodarilo sa zmazať záchranára");
    } finally {
      // D) refresh – zosynchronizuje UI (potvrdí alebo rollbackne optimistiku)
      setIsDeleting(false);
      router.refresh();
    }
  }

  const currentIdx = roster.findIndex((u) => u.user_id === user.user_id);

  return (
    <>
      <div
        className={`flex items-center justify-between border-b border-l border-slate-200 px-2 py-1 text-[0.65rem] hover:bg-blue-100 2xl:text-[1rem] ${rowBg}`}
      >
        <button
          type="button"
          className="flex cursor-pointer items-center justify-start text-left hover:scale-105"
          onClick={handleClick}
        >
          {currentIdx + 1}. {children}
        </button>
        <span className="text-xs 2xl:text-sm">{position}</span>
      </div>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          {admin === "ÁNO" ? (
            <ConfirmDelete
              resourceName="Zachranára"
              onConfirm={handleConfirmDelete}
              onClose={() => setIsOpenDeleteModal(false)}
              disabled={isDeleting}
              user={user}
            />
          ) : (
            <WarningNotice />
          )}
        </Modal>
      )}
    </>
  );
}
