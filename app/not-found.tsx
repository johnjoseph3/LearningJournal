import CustomLink from "@/components/custom-link"

export default function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>Could not find requested resource</p>
      <CustomLink href="/" className="underline">
        Return Home
      </CustomLink>
    </div>
  )
}
