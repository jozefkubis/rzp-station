"use client";

import { deleteProfileFromRoster } from "@/app/_lib/actions";
import { useState } from "react";
import Modal from "../Modal";
import ConfirmDelete from "../ConfirmDelete";
import toast from "react-hot-toast";
import { mutate } from "swr"; // alebo const { mutate } = useSWRConfig()

export default function AllParamedics({ children, rowBg, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** 1️⃣ otvor modál */
  const handleClick = () => setIsOpen(true);

  /** 2️⃣ optimistický delete + server call */
  const handleConfirmDelete = async () => {
    // --- a) okamžitý zápis do cache (žiadna sieť) -----------------
    mutate(
      "/api/shifts",
      (curr = []) => curr.filter((s) => s.user_id !== user.user_id), // odstráň shift lokálne
      false, // ← revalidate: false  → UI sa prepíše ihneď, fetch zatiaľ nebeží
    );

    // --- b) server request ----------------------------------------
    try {
      setIsDeleting(true);
      await deleteProfileFromRoster(user.user_id);
      toast.success("Záchranár odstránený");

      // --- c) revalidate na pozadí – zosynchronizuj pravdu --------
      mutate("/api/shifts"); // spustí fetch, vráti reálne dáta
    } catch (err) {
      toast.error("Nepodarilo sa vymazať");
      // rollback: jednoducho znova refetchni server
      mutate("/api/shifts");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`sticky left-0 z-20 flex items-center justify-between px-3 py-1 ${rowBg} hover:bg-blue-100`}
        onClick={!isDeleting ? handleClick : undefined}
      >
        {children}
      </button>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <ConfirmDelete
            resourceName="záchranára"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpen(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
