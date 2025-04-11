import { signup } from "../actions"

export default async function handleSubmitRegistration(e, { setError, router }) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const image = e.currentTarget.image?.files?.[0] || null

    console.log("Image z inputu:", image)

    if (image) {
        formData.append("image", image)
    }

    const response = await signup(formData)

    if (response?.error) {
        setError(response.error)
    } else {
        router.push("/")
    }
}
