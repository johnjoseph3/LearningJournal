import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

interface TopicNameInputProps {
  initialName: string
  onChange: (name: string) => void
  onBlur: () => void
}

export default function TopicNameInput({
  initialName,
  onChange,
  onBlur
}: TopicNameInputProps) {
  const [name, setName] = useState(initialName)

  const debouncedOnChange = useDebouncedCallback((name: string) => {
    onChange(name)
  }, 1000)

  return (
    <Input
      className="font-bold leading-tight text-3xl mr-10"
      onChange={(event) => {
        setName(event.target.value)
        debouncedOnChange(event.target.value)
      }}
      onBlur={onBlur}
      value={name}
      autoFocus
    />
  )
}
