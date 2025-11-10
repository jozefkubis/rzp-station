import "@/app/_styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Toaster } from "react-hot-toast";
// import Header from "./_components/Header"
// import { Josefin_Sans } from "next/font/google"

// const josefin = Josefin_Sans({
//   subsets: ["latin"],
//   display: "swap",
// })

export const runtime = "edge";
// export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    template: "%s RZP Rajec",
    default: "RZP Rajec 😎",
  },
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <main className="w-full">
          <Toaster position="top-center" />

          {/* Hlavný obsah – centrovaný kontajner */}
          <div className="mx-auto w-full max-w-6xl px-2 sm:px-4 lg:px-6 xl:px-8">
            {children}
          </div>

          <SpeedInsights />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
