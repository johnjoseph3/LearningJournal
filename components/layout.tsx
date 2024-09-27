import Header from "./header.tsx"
import Footer from "./footer.tsx"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
