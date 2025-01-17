import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()

    const topic = await prisma.topic.findUnique({
      where: {
        id: body.id
      }
    })

    if (!topic) {
      return Response.json({ message: "Topic not found" }, { status: 500 })
    }

    const categoryTopics = await prisma.topic.findMany({
      where: {
        categoryId: topic.categoryId
      }
    })

    const lastEntry = categoryTopics.length === 1

    await prisma.topic.delete({
      where: {
        id: body.id
      }
    })

    if (lastEntry) {
      await prisma.topicCategory.delete({
        where: {
          id: topic.categoryId
        }
      })
    }
    
    return Response.json("Successfully deleted")
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
