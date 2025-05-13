import toast from "react-hot-toast"
import { createNewTask } from "../actions"

// handleSubmitNewTask.js
export default async function handleSubmitNewTask(e, { setError, onClose, refresh }) {
    e.preventDefault();
    const resp = await createNewTask(new FormData(e.currentTarget));
    if (resp?.error) {
        setError(resp.error);
        return;
    }
    toast.success("Úloha pridaná");
    refresh();           // ← tu voláš opätovné načítanie kalendára
    onClose();
}
