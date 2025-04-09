import React from "react"
import { useFormStatus } from "react-dom"
import SpinnerMini from "./SpinnerMini"

export default function RegisterButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="disable:bg-creamy-300 bg-quatertary-900 text-primary-50 font-semibold py-3 rounded-md hover:bg-quatertary-800 transition my-4 w-full active:scale-95 text-xl"
    >
      {pending ? <SpinnerMini /> : "Registrovať sa"}
    </button>
  )
}
