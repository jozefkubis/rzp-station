import toast from "react-hot-toast";
import { signup } from "../actions";

export default async function handleSubmitRegistration(
  e,
  { setError, status },
) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const response = await signup(formData);

  if (status !== "admin") toast.error("Do vybranej zložky nemáš prístup!");

  if (response?.error) {
    setError(response.error);
  } else {
    e.target.reset();
    toast.success("Registrácia bola uspešná.");
  }
}
