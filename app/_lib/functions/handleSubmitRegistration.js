import { signup } from "../actions"

export default async function handleSubmitRegistration(e, { setError, router }) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const response = await signup(formData)

    if (response?.error) {
        setError(response.error)
    }
}