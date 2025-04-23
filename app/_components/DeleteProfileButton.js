'use client';

import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmDelete from "./ConfirmDelete";

export default function DeleteProfileButton({ profileId }) {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpenModal = () => {
        setIsOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        const res = await fetch(`/api/delete-user?id=${profileId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            toast.success("Používateľ vymazaný");
            location.reload();
        } else {
            toast.error("Chyba pri mazaní");
        }

        setIsDeleting(false);
        setIsOpenDeleteModal(false);
    };

    return (
        <>
            <button onClick={handleOpenModal} className="text-red-600 hover:text-red-800">
                <RiDeleteBinLine size={15} />
            </button>

            {isOpenDeleteModal && (
                <Modal onClose={() => setIsOpenDeleteModal(false)}>
                    <ConfirmDelete
                        resourceName="používateľa"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setIsOpenDeleteModal(false)}
                        disabled={isDeleting}
                    />
                </Modal>
            )}
        </>
    );
}
