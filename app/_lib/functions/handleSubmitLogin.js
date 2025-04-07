import { login } from "../actions"

export default async function handleSubmitLogin(e, { setError, router }) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await login(formData)

    if (response?.error) {
        setError(response.error)
    } else {
        setTimeout(() => router.push("/"), 1000)
    }
}
