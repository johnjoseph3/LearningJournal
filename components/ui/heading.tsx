import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils.ts"

interface HeadingProps {
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  className?: string
  onClick?: () => void
}

export function Heading(params: PropsWithChildren<HeadingProps>) {
  const { children, size, className, onClick } = params

  const classes = cn("font-extrabold", {
    "text-4xl my-5": size === "h1",
    "text-3xl my-4": size === "h2",
    "text-2xl my-3": size === "h3",
    "text-1xl my-3": size === "h4",
    "text-xl my-3": size === "h5",
    "text-lg my-3": size === "h6"
  }, className)

  switch (size) {
    case "h1":
      return (
        <h1 className={classes} onClick={onClick}>
          {children}
        </h1>
      )
    case "h2":
      return (
        <h2 className={classes} onClick={onClick}>
          {children}
        </h2>
      )
    case "h3":
      return (
        <h3 className={classes} onClick={onClick}>
          {children}
        </h3>
      )
    case "h4":
      return (
        <h4 className={classes} onClick={onClick}>
          {children}
        </h4>
      )
    case "h5":
      return (
        <h5 className={classes} onClick={onClick}>
          {children}
        </h5>
      )
    case "h6":
      return (
        <h6 className={classes} onClick={onClick}>
          {children}
        </h6>
      )
    default:
      return null
  }
}
