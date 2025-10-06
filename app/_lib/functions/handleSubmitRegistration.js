import toast from "react-hot-toast";
import { signup } from "../actions";

export default async function handleSubmitRegistration(
  e,
  { setError, admin, setIsOpenModal },
) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const response = await signup(formData);

  if (admin !== "ÁNO") setIsOpenModal(true);

  if (response?.error) {
    setError(response.error);
  } else {
    e.target.reset();
    toast.success("Registrácia bola uspešná.");
  }
}
