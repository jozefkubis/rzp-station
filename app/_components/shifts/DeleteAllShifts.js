"use client";

import { useState } from "react";
import Button from "../Button";
import { clearMonth } from "@/app/_lib/actions";
import Modal from "../Modal";
import ConfirmDelete from "../ConfirmDelete";
// import { useRouter } from "next/navigation";

export default function DeleteAllShifts() {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;


  function handleOpenModal() {
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await clearMonth(year, month);
    setIsDeleting(false);
    setIsOpenDeleteModal(false);
  }


  return (
    <>
      <div className="mt-6 self-start 2xl:px-32">
        <Button variant="danger" onClick={handleOpenModal}>
          🧹 Vymaž celý mesiac"
        </Button>
      </div>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="Všetky služby"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
