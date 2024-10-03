import { signIn } from "next-auth/react"
import { Heading } from "@/components/ui/heading"

export default function AccessDenied() {
  return (
    <>
      <Heading size="h1">Access Denied</Heading>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          You must be signed in to view this page
        </a>
      </p>
    </>
  )
}
