import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  const slug = context.params?.slug as string

  if (req.auth && slug) {
    const page = await prisma.page.findUnique({
      where: {
        slug,
        public: true
      },
      include: {
        entries: {
          where: {
            draft: false
          },
          orderBy: {
            order: "asc"
          }
        },
        topic: {}
      }
    })

    if (!page) {
      return Response.json({ message: "Could not find page" }, { status: 500 })
    }

    const owner = req.auth?.user?.id === page.userId

    return Response.json({ page, owner })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
