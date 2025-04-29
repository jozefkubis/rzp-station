import toast from "react-hot-toast"
import { InsertUpdateProfilesData } from "../actions"

export default async function handleSubmitUploadProfileData(e, { setError, avatar }) {
    e.preventDefault()
    const formData = new FormData(e.target)

    // Pridaj obrázok do formData ak existuje
    if (avatar) {
        formData.append("avatar", avatar)
    }

    // Voláme serverovú funkciu na ukladanie dát
    const response = await InsertUpdateProfilesData(formData)

    // Ak sa vráti chyba, nastavíme ju
    if (response?.error) {
        setError(response.error)
    } else {
        toast.success("Profil bol aktualizovaný.")
    }
}
