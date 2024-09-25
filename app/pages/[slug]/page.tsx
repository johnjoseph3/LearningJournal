import { prisma } from "../../../prisma/prisma"
import Entries from "@/components/page/entries"

export default async function Page({ params }: { params: { slug: string } }) {
    const page = await prisma.page.findUnique({
        where: {
            slug: params.slug
        },
        include: {
            entries: true,
        },
    })

    if (!page) {
        return "could not find page"
    }

    return <Entries entries={page.entries} pageId={page.id} />
}