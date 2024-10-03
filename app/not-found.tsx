import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"

export default function NotFound() {
  return (
    <div>
      <Heading size="h1">Not Found</Heading>
      <p>Could not find requested resource</p>
      <CustomLink href="/" className="underline">
        Return Home
      </CustomLink>
    </div>
  )
}
