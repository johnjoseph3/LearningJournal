import { PrismaClient } from "@prisma/client"
import { tipTapService } from "@/app/services/tiptap.service"
import { awsService } from "@/app/services/aws.service"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      $allModels: {
        async delete({ model, operation, args, query }) {
          let imageUrls: string[] = []

          // Delete images from S3 when deleting an entry or a topic
          if (model === "Entry") {
            const id = args.where.id
            if (!id) throw new Error("ID is required to delete")

            const entry = await prisma.entry.findUnique({ where: { id } })
            if (!entry) throw new Error("Entry not found")

            imageUrls = tipTapService.extractImageUrls(entry?.content)
          } else if (model === "Topic") {
            const id = args.where.id
            if (!id) throw new Error("ID is required to delete")

            const pages = await prisma.page.findMany({
              where: { topicId: id }
            })
            const entries = await prisma.entry.findMany({
              where: { pageId: { in: pages.map((page) => page.id) } }
            })

            for (const entry of entries) {
              imageUrls = imageUrls.concat(
                tipTapService.extractImageUrls(entry.content)
              )
            }
          }

          for (const url of imageUrls) {
            await awsService.deleteS3Image(url)
          }

          return query(args)
        }
      }
    }
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
