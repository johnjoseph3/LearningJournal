import CustomLink from "./custom-link.tsx"
import {  GithubIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mx-0 my-4 flex w-full flex-col gap-4 px-4 text-sm sm:mx-auto sm:my-12 sm:h-5 sm:max-w-7xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <CustomLink href="https://github.com/johnjoseph3/LearningJournal">
          <GithubIcon className="ml-1 inline-block h-4 w-4" />
        </CustomLink>
        <CustomLink href="https://raw.githubusercontent.com/johnjoseph3/LearningJournal/refs/heads/main/LICENSE">
          Policy
        </CustomLink>
      </div>
      <div className="flex items-center justify-start gap-2"></div>
    </footer>
  )
}
