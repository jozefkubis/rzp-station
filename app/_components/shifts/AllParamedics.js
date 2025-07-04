"use client";

import { deleteProfileFromRoster } from "@/app/_lib/actions";
import { startTransition, useState } from "react";
import Modal from "../Modal";
import ConfirmDelete from "../ConfirmDelete";
import { useRouter } from "next/navigation";

export default function AllParamedics({
  children,
  rowBg,
  user,
  onDeleteOptimistic,
}) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function handleClick() {
    // deleteProfileFromRoster(user.user_id);
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    startTransition(() => onDeleteOptimistic(user.user_id));
    await deleteProfileFromRoster(user.user_id);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className={`sticky left-0 z-20 flex items-center justify-between px-3 py-1 ${rowBg} cursor-pointer hover:bg-blue-100`}
        onClick={!isDeleting ? handleClick : undefined}
      >
        {children}
      </button>

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
