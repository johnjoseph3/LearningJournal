import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"
import { Topic } from "@prisma/client"
import { prisma } from "@/prisma/prisma.ts"
import { auth } from "auth"

async function fetchTopics(): Promise<Topic[]> {
  const session = await auth()
  if (!session?.user) {
    return []
  }

  return await prisma.topic.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      page: {},
      subject: {}
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export default async function Index() {
  const topics = await fetchTopics()

  return (
    <div>
      <PageHeader title="Dashboard" />
      <TopicList topics={topics} />
    </div>
  )
}
