import { PrismaClient } from "@prisma/client"
import { tipTapService } from "@/app/services/tiptap.service"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      $allModels: {
        async delete({ model, operation, args, query }) {
          if (model === "Entry" || model === "Topic") {
            const id = args.where.id
            if (!id) throw new Error("ID is required to delete")
            await tipTapService.deleteImages(model, id)
          }
          return query(args)
        }
      }
    }
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
