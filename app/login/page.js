import LoginForm from "@/app/_components/login/LoginForm"

export const metadata = {
  title: "Prihlásenie",
}

export default async function Page() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-login-bg bg-cover bg-center filter z-0"></div>

      {/* Pulse Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50 animate-pulse-gradient z-10"></div> */}

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <LoginForm />
      </div>
    </div>
  )
}

