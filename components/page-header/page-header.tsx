import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

interface PageHeaderProps {
  title: string
  rightChild?: React.ReactNode
}

export default function TopicNameInput({ title, rightChild }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex justify-between">
        <Heading size="h1">
          {title}
        </Heading>
        <div className="flex items-center">
          <div className="flex items-center">{rightChild}</div>
        </div>
      </div>
      <Separator />
    </div>
  )
}
