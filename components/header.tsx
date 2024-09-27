import { MainNav } from "./main-nav.tsx"
import UserButton from "./user-button.tsx"
import { ModeToggle } from "./mode-toggle.tsx"

export default function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <MainNav />
        <div className="flex">
          <div className="mr-5">
            <UserButton />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
