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

// TODO figure out prisma transaction syntax and apply it here

export const POST = auth(async (req) => {
  if (req.auth) {
    let newTopicCategoryCreated = false
    let topicCategoryId = null
    try {
      const body = await req.json()
      const userId = req.auth.user?.id as string

      const { categoryId, newCategoryName, topicName, createNewCategory } = body

      let topicCategory

      if (categoryId && !createNewCategory) {
        topicCategory = await prisma.topicCategory.findUnique({
          where: {
            id: parseInt(categoryId)
          }
        })
      } else {
        topicCategory = await prisma.topicCategory.create({
          data: { name: newCategoryName, userId }
        })
        newTopicCategoryCreated = true
        topicCategoryId = topicCategory.id
      }

      if (!topicCategory) {
        throw new Error("Could not find or create category")
      }

      const topic = await prisma.topic.create({
        data: {
          name: topicName,
          userId,
          categoryId: topicCategory.id
        }
      })

      const page = await prisma.page.create({
        data: {
          topicId: topic.id,
          slug: slugify(topicName),
          userId
        }
      })

      return Response.json({
        topic: {
          ...topic,
          pages: [page]
        }
      })
    } catch (error: any) {
      if (newTopicCategoryCreated && topicCategoryId) {
        await prisma.topicCategory.delete({
          where: {
            id: topicCategoryId
          }
        })
      }
      return Response.json(
        { message: error?.message || "Could not create topic" },
        { status: 500 }
      )
    }
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
