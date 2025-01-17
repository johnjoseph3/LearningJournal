import { PrismaClient } from "@prisma/client"
import { awsService } from "./aws.service"

class TipTapService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  extractImageUrls(json: any): string[] {
    const imageUrls: string[] = []

    const traverse = (node: any) => {
      if (node.type === "image" && node.attrs && node.attrs.src) {
        imageUrls.push(node.attrs.src)
      }
      if (node.content) {
        node.content.forEach((child: any) => traverse(child))
      }
    }

    traverse(json)
    return imageUrls
  }

  async deleteImages(model: string, id: number) {
    let imageUrls: string[] = []

    switch (model) {
      case "Entry":
        const entry = await this.prisma.entry.findUnique({ where: { id } })
        if (!entry) throw new Error("Entry not found")
        imageUrls = this.extractImageUrls(entry?.content)
        break
      case "Topic":
        const pages = await this.prisma.page.findMany({
          where: { topicId: id }
        })
        const entries = await this.prisma.entry.findMany({
          where: { pageId: { in: pages.map((page) => page.id) } }
        })
        for (const entry of entries) {
          imageUrls = imageUrls.concat(this.extractImageUrls(entry.content))
        }
        break
      default:
        break
    }
    for (const url of imageUrls) {
      await awsService.deleteS3Image(url)
    }
  }
}

export const tipTapService = new TipTapService()
