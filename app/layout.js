import "@/app/_styles/globals.css"
// import Header from "./_components/Header"
// import { Josefin_Sans } from "next/font/google"

// const josefin = Josefin_Sans({
//   subsets: ["latin"],
//   display: "swap",
// })

export const metadata = {
  title: {
    template: "%s RZP",
    default: "Vitajte / RZP",
  },
  description:
    "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body /*className={`${josefin.className}`}*/>
        {/* <Header /> */}
        {/* <div className=""> */}
        <main className="mx-auto w-full">{children}</main>
        {/* </div> */}
      </body>
    </html>
  )
}
