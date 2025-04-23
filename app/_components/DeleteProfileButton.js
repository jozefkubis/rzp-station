'use client';

import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function DeleteProfileButton({ profileId }) {
    const handleDelete = async () => {
        const confirmed = confirm("Naozaj chceš vymazať tento profil?");
        if (!confirmed) return;

        const res = await fetch(`/api/delete-user?id=${profileId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            toast.success("Používateľ vymazaný");
            location.reload();
        } else {
            toast.error("Chyba pri mazaní");
        }
    };

    return (
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
            <RiDeleteBinLine size={15} />
        </button>
    );
}
