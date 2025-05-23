import toast from "react-hot-toast";
import { updateTask } from "../actions";

export default async function handleSubmitUpdateTaskForm(e, { setError, onClose, refresh }) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await updateTask(formData);

    if (response?.error) {
        setError(resp.error);
        return;
    }
    toast.success("Úloha aktualizovaná");
    refresh();
    onClose();
}