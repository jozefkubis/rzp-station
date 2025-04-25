import { updateUser } from "../actions";

export default async function handleSubmitUpdateUserData(e, { setError }) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const response = await updateUser(formData);

  if (response?.error) {
    setError(response.error);
    return;
  }

  e.target.reset();
}
