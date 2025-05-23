"use client";

import { login } from "../actions";

export default async function handleSubmitLogin(e, { setError }) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const result = await login(formData);

  if (result?.error) {
    setError(result.error);
    return;
  }
}
