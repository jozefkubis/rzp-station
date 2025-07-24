import "@/app/_styles/globals.css";
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
      <body /*className={`${josefin.className}`}*/>
        {/* <Header /> */}
        {/* <div className=""> */}
        <main className="mx-auto w-full">
          <Toaster position="top-center" />
          {children}
        </main>
        {/* </div> */}
      </body>
    </html>
  );
}
