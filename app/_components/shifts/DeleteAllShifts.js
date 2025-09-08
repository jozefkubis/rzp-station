"use client";

import { clearMonth } from "@/app/_lib/actions";
import { getYearMonthFromOffset } from "@/app/_lib/helpers/functions";
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
  const offset = Number(searchParams.get("m") ?? "0");
  const { year, month } = getYearMonthFromOffset(offset);

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true);
      await clearMonth(year, month);
    } catch (err) {
      console.error("clearMonth error:", err);
    } finally {
      setIsDeleting(false);
      setIsOpenDeleteModal(false);
    }
  }

  return (
    <>
      <div>
        <Button variant="danger" onClick={() => setIsOpenDeleteModal(true)}>
          Vymazať všetko
        </Button>
      </div>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="všetko"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
