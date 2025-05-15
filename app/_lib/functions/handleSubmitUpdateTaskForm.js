import toast from "react-hot-toast";
import { updateTask } from "../actions";

export default async function handleSubmitUpdateTaskForm(e, { setError, onClose, refresh }) {
    e.preventDefault();
    const resp = await updateTask(new FormData(e.currentTarget));
    if (resp?.error) {
        setError(resp.error);
        return;
    }
    toast.success("Úloha aktualizovaná");
    refresh();           // ← tu voláš opátovné načítanie kalendára
    onClose();
}