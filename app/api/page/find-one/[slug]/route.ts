import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  const slug = context.params?.slug as string

  if (req.auth && slug) {
    const page = await prisma.page.findUniqueOrThrow({
      where: {
        slug,
        userId: req.auth.user?.id
      },
      include: {
        entries: {
          orderBy: {
            order: "asc"
          }
        }
      }
    })
     
    return Response.json({ page })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
