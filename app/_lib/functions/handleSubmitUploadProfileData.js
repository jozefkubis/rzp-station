import { InsertUpdateProfilesDataForm } from "../actions"

export default async function handleSubmitUploadProfileData(e, { setError, avatar }) {
    e.preventDefault()
    const formData = new FormData(e.target)

    // Pridaj obrázok do formData ak existuje
    if (avatar) {
        formData.append("avatar", avatar)
    }

    // Voláme serverovú funkciu na ukladanie dát
    const response = await InsertUpdateProfilesDataForm(formData)

    // Ak sa vráti chyba, nastavíme ju
    if (response?.error) {
        setError(response.error)
    }
}
