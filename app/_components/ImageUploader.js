import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"

export default function ImageUploader({ onAvatarSelect, avatar }) {
  const [preview, setPreview] = useState(
    avatar instanceof File ? URL.createObjectURL(avatar) : avatar || null
  )

  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  // Ak sa `avatar` zmení, nastavíme nový `preview`
  useEffect(() => {
    if (avatar instanceof File) {
      setPreview(URL.createObjectURL(avatar))
    } else {
      setPreview(avatar || null) // Ak je URL, použijeme ju priamo
    }
  }, [avatar])

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setPreview(URL.createObjectURL(file)) // 🖼 Zobrazíme náhľad
        onAvatarSelect(file) // 🔥 Pošleme obrázok rodičovi
      }
    },
    [onAvatarSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "avatar/jpeg": [".jpg", ".jpeg"],
      "avatar/png": [".png"],
      "avatar/gif": [".gif"],
    },
    multiple: false,
  })

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="border-dashed border-2 p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Pustite súbor sem...</p>
        ) : (
          <p className="text-primary-50">
            Pretiahnite obrázok sem alebo kliknite na výber
          </p>
        )}
      </div>

      {/* 🖼 Náhľad obrázka */}
      {preview && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Vybraný obrázok:</p>
          <img
            src={preview || blankAvatar}
            alt="Náhľad"
            className="w-40 h-40 object-cover mx-auto rounded-full"
          />
        </div>
      )}
    </div>
  )
}
