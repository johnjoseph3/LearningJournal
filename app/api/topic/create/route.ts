import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, "") // trim leading/trailing white space
  str = str.toLowerCase() // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove consecutive hyphens
  return str
}

export const POST = auth(async (req) => {
  if (req.auth) {
    try {
      const body = await req.json()
      const userId = req.auth.user?.id as string

      const { subjectId, newSubjectName, topicName, createNewSubject } = body

      const result = await prisma.$transaction(async (tx) => {
        let subject

        if (subjectId && !createNewSubject) {
          subject = await tx.subject.findUnique({
            where: {
              id: parseInt(subjectId)
            }
          })
          if (!subject) {
            throw new Error("Could not find subject")
          }
        } else {
          subject = await tx.subject.create({
            data: { name: newSubjectName, userId }
          })
        }

        const topic = await tx.topic.create({
          data: {
            name: topicName,
            userId,
            subjectId: subject.id
          }
        })

        const page = await tx.page.create({
          data: {
            topicId: topic.id,
            slug: slugify(topicName),
            userId
          }
        })

        return {
          topic: {
            ...topic,
            pages: [page]
          }
        }
      })

      return Response.json(result)
    } catch (error: any) {
      return Response.json(
        { message: error?.message || "Could not create topic" },
        { status: 500 }
      )
    }
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
