import { login } from "../actions"

export default async function handleSubmitLogin(e, { setError }) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await login(formData)

    if (response?.error) {
        setError(response.error)
    }
}
