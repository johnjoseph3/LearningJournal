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

    const subjectTopics = await prisma.topic.findMany({
      where: {
        subjectId: topic.subjectId
      }
    })

    const lastEntry = subjectTopics.length === 1

    await prisma.topic.delete({
      where: {
        id: body.id
      }
    })

    if (lastEntry) {
      await prisma.subject.delete({
        where: {
          id: topic.subjectId
        }
      })
    }

    return Response.json("Successfully deleted")
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
