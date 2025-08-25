"use client";

import { clearOnlyShifts } from "@/app/_lib/actions";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "../Button";
import ConfirmDelete from "../ConfirmDelete";
import Modal from "../Modal";
// import { useRouter } from "next/navigation";

export default function DeleteAllShifts() {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const urlOffset = searchParams.get("m") ?? "0";
  const offset = Number(urlOffset);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + offset + 1;

  function handleOpenModal() {
    setIsOpenDeleteModal(true);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await clearOnlyShifts(year, month);
    setIsDeleting(false);
    setIsOpenDeleteModal(false);
  }

  return (
    <>
      <div className="">
        <Button onClick={handleOpenModal}>
          Vymazať služby
        </Button>
      </div>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="služby"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
