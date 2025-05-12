import { cn } from "@/lib/utils.ts"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface CustomLinkProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  href: string
}

const CustomLink = ({
  href,
  children,
  className,
  ...rest
}: CustomLinkProps) => {
  const isInternalLink = href.startsWith("/")
  const isAnchorLink = href.startsWith("#")

  const classes = cn(
    "inline-flex items-center gap-1 align-baseline hover:underline underline-offset-4",
    className
  )

  return (
    <Link
      href={href}
      className={classes}
      target={isInternalLink || isAnchorLink ? undefined : "_blank"}
      rel={isInternalLink || isAnchorLink ? undefined : "noopener noreferrer"}
      {...rest}
    >
      {isInternalLink || isAnchorLink ? children : <span>{children}</span>}
      {!isInternalLink && !isAnchorLink && (
        <ExternalLink className="ml-0.5 inline-block h-4 w-4" />
      )}
    </Link>
  )
}

export default CustomLink
