import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import Footer from "@/components/footer.tsx"
import Header from "@/components/header.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { auth } from "auth"
import { Heading } from "@/components/ui/heading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Learning Journal",
  description: "Track your learning"
}

export default async function RootLayout({
  children
}: React.PropsWithChildren) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full min-h-screen w-full flex-col justify-between">
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-auto px-4 py-4 sm:px-6 md:py-6">
              {!session?.user ? (
                <>
                  <Heading size="h1">Welcome</Heading>
                  <p>Sign in to track your learning</p>
                </>
              ) : (
                children
              )}
              <Toaster />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
