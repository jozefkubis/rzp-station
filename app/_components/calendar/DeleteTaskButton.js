"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteTask } from "@/app/_lib/actions";
import Button from "@/app/_components/Button";
import SpinnerMini from "@/app/_components/SpinnerMini";

export default function DeleteTaskButton({ task, onClose, refresh }) {

    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteTask(task.id);
                toast.success("Úloha vymazaná");
                refresh();
                onClose();
            } catch (err) {
                console.error(err);
                toast.error("Ups, nepodarilo sa vymazať");
            }
        });
    };

    return (
        <Button
            data-cy="delete-task-button"
            variant="danger"
            size="medium"
            onClick={handleDelete}
            disabled={isPending}
            type="button"
        >
            {isPending ? <SpinnerMini /> : "Vymazať"}
        </Button>
    );
}
