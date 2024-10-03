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
    }

    if (!topicCategory) {
      return Response.json(
        { message: "Could not find or create category" },
        { status: 500 }
      )
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
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
