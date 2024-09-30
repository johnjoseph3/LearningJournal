import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const john = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      name: "John Doe"
    }
  })

  const topicCategory = await prisma.topicCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Programming",
      userId: john.id
    }
  })

  const topic = await prisma.topic.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Python",
      userId: john.id,
      categoryId: topicCategory.id
    }
  })

  await prisma.page.upsert({
    where: { id: 1 },
    update: {},
    create: {
      topicId: topic.id,
      slug: "python",
      userId: john.id
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
