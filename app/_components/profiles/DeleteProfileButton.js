"use client";

// import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "@/app/_components/Modal";
import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

export default function DeleteProfileButton({ profileId }) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setIsOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    const res = await fetch(`/api/delete-user?id=${profileId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Používateľ vymazaný");
      // location.reload();
      router.push("/profiles");
    } else {
      toast.error("Chyba pri mazaní");
    }

    setIsDeleting(false);
    setIsOpenDeleteModal(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleOpenModal}>
        {/* <RiDeleteBinLine size={15} /> */}
        Vymazať užívateľa
      </Button>

      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <ConfirmDelete
            resourceName="užívateľa"
            onConfirm={handleConfirmDelete}
            onClose={() => setIsOpenDeleteModal(false)}
            disabled={isDeleting}
          />
        </Modal>
      )}
    </>
  );
}
