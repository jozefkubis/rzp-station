import { register } from "../actions"

export default async function handleSubmitRegistration(e, { setError, router }) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const response = await register(formData)

    if (response?.error) {
        setError(response.error)
    } else {
        setTimeout(() => router.push("/login"), 1000)
    }
}