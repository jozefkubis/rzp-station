import LoginForm from "@/app/_components/LoginForm"
// import { redirect } from "next/navigation"

export const metadata = {
  title: "Prihlásenie",
}

export default async function Page() {


  return (
    <div>
      <LoginForm />
    </div>
  )
}
