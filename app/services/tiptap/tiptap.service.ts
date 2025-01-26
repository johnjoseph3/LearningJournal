class TipTapService {
  extractImageUrls(json: any): string[] {
    const imageUrls: string[] = []
    if (json === null || json === undefined) {
      return imageUrls
    }

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
}

export const tipTapService = new TipTapService()
