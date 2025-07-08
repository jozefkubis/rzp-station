"use client";

import { deleteProfileFromRoster, moveArrow } from "@/app/_lib/actions";
import { startTransition, useState } from "react";
import Modal from "../Modal";
import ConfirmDelete from "../ConfirmDelete";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export default function AllParamedics({
  children,
  rowBg,
  user,
  onDeleteOptimistic,
  roster,
  idx,
}) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  function handleClick() {
    // deleteProfileFromRoster(user.user_id);
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    // A) okamžitý optimistický update (riadok zmizne hneď)
    startTransition(() => onDeleteOptimistic(user.user_id));

    try {
      // B) skutočný DELETE na serveri
      await deleteProfileFromRoster(user.user_id);

      // C) spätná väzba pre používateľa
      toast.success(`${user.full_name ?? "Záchranár"} odstránený zo služieb`);
    } catch (err) {
      toast.error("Nepodarilo sa zmazať záchranára");
    } finally {
      // D) refresh – zosynchronizuje UI (potvrdí alebo rollbackne optimistiku)
      router.refresh();
    }
  }


  async function handleReorder(dir) {
    setLoading(true);
    try {
      await moveArrow({ userId: user.user_id, direction: dir });
      router.refresh();          // načíta novo zoradený roster
    } catch (err) {
      toast.error('Nepodarilo sa zmeniť poradie');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-2 py-1">
        <button
          type="button"
          className={`sticky left-0 z-20 flex items-center justify-between  ${rowBg} cursor-pointer hover:bg-blue-100`}
          onClick={!isDeleting ? handleClick : undefined}
        >
          {children}
        </button>

        <div className="flex flex-col">
          <button type="button" disabled={loading || idx === 0} onClick={() => handleReorder("up")} aria-label="Posunúť hore">
            <FaAngleUp className="text-primary-500 h-3 w-3 hover:text-primary-700 hover:font-bold" />
          </button>
          <button type="button" disabled={loading || idx === roster.length - 1} onClick={() => handleReorder("down")} aria-label="Posunúť dole">
            <FaAngleDown className="text-primary-500 h-3 w-3 hover:text-primary-700 hover:font-bold" />
          </button>
        </div>
      </div >

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="Zachranára"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )
      }
    </>
  );
}