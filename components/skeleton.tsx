import { Skeleton as ShadcnSkeleton } from "./ui/skeleton"

export default function Skeleton() {
  return (
    <div className="flex items-center space-x-4">
      <ShadcnSkeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <ShadcnSkeleton className="h-4 w-[250px]" />
        <ShadcnSkeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}