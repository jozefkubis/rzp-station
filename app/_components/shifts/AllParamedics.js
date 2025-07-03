import { deleteProfileFromRoster } from "@/app/_lib/actions";
import { useState } from "react";
import Modal from "../Modal";
import ConfirmDelete from "../ConfirmDelete";

export default function AllParamedics({ children, rowBg, user }) {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleClick() {
        // deleteProfileFromRoster(user.user_id);
        setIsOpenDeleteModal(true);
    }

    async function handleConfirmDelete() {
        setIsDeleting(true);
        await deleteProfileFromRoster(user.user_id);
        setIsDeleting(false);
        setIsOpenDeleteModal(false);
    }

    return (
        <>
            <button
                type="button"
                className={`sticky left-0 z-20 flex items-center justify-between px-3 py-1 ${rowBg} hover:bg-blue-100 cursor-pointer`}
                onClick={handleClick}
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
    )
}