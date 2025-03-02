import { Urbanist } from "next/font/google"
import "./globals.css"

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-urbanist",
})

export const metadata = {
  title: "RSKD Talent - HR Management Tool",
  description: "A full-stack HR management hiring tool"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} font-urbanist`}>{children}</body>
    </html>
  )
}