import { prisma } from "@/prisma/prisma.ts"
import { faker } from "@faker-js/faker"

async function main() {
  console.log("Seeding database...")

  const user = await prisma.user.findUnique({
    where: { email: "johnjosephnc@gmail.com" }
  })

  if (!user) {
    console.error("User with email johnjosephnc@gmail.com not found.")
    process.exit(1)
  }

  const userId = user.id

  for (let i = 0; i < 65; i++) {
    const subject = await prisma.subject.create({
      data: {
        name: faker.lorem.words(3),
        userId,
        topic: {
          create: Array.from({ length: 3 }).map(() => ({
            name: faker.lorem.words(2),
            user: { connect: { id: userId } },
            page: {
              create: {
                public: i < 25,
                user: { connect: { id: userId } },
                slug: faker.lorem.slug(4)
              }
            }
          }))
        }
      }
    })

    console.log(`Created subject: ${subject.name}`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
