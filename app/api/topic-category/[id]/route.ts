import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  const id = context.params?.id as string

  if (req.auth) {
    const category = await prisma.topicCategory.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!category) {
      return Response.json({ message: "Could not find category" }, { status: 500 })
    }

    return Response.json({ category })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
