import toast from "react-hot-toast"
import { AdminUpdateProfilesData } from "../actions"

export default async function handleSubmitAdminUpdateProfileData(e, { setError }) {
    e.preventDefault()
    const formData = new FormData(e.target)

    // Voláme serverovú funkciu na ukladanie dát
    const response = await AdminUpdateProfilesData(formData)

    // Ak sa vráti chyba, nastavíme ju
    if (response?.error) {
        setError(response.error)
    } else {
        toast.success("Profil bol aktualizovaný.")
    }
}
