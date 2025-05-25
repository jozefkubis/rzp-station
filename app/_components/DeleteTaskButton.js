"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteTask } from "../_lib/actions";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";

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
