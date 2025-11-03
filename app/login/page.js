import LoginForm from "@/app/_components/login/LoginForm";

export const metadata = {
  title: "Prihlásenie",
};

export default async function Page() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-primary-700 bg-cover bg-center filter md:bg-login-bg"></div>

      {/* Pulse Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50 animate-pulse-gradient z-10"></div> */}

      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
