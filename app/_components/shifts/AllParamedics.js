"use client";

import { deleteProfileFromRoster } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDelete from "../ConfirmDelete";
import Modal from "../Modal";

export default function AllParamedics({
  children,
  user,
  onDeleteOptimistic,
  roster,
  rowBg,
}) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function handleClick() {
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    // A) okamžitý optimistický update (riadok zmizne hneď)
    startTransition(() => onDeleteOptimistic(user.user_id));
    setIsDeleting(true);

    try {
      // B) skutočný DELETE na serveri
      await deleteProfileFromRoster(user.user_id);

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
        className={`sticky left-0 flex items-center justify-between border-b border-l border-slate-200 px-2 py-1 text-[1rem] hover:bg-blue-100 ${rowBg}`}
      >
        <button
          type="button"
          className="sticky left-0 z-20 flex cursor-pointer items-center justify-between hover:scale-105"
          onClick={handleClick}
        >
          {currentIdx + 1}. {children}
        </button>
      </div>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="Zachranára"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
