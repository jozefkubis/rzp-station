"use client";

import Button from "@/app/_components/Button";
import SpinnerMini from "@/app/_components/SpinnerMini";
import { deleteTask } from "@/app/_lib/actions";
import { useTransition } from "react";
import toast from "react-hot-toast";

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
            size="large"
            onClick={handleDelete}
            disabled={isPending}
            type="button"
        >
            {isPending ? (
                <div className="inline-flex items-center gap-2">
                    Mažem
                    <span>
                        <SpinnerMini />
                    </span>
                </div>
            ) : (
                "Vymazať"
            )}
        </Button>
    );
}
