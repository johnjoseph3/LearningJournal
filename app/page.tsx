"use client"

import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"
import DataFetcher from "@/components/data-fetcher/data-fetcher"
import { Topic } from "@prisma/client"

export default function Index() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <DataFetcher<{ topics: Topic[] }>
        endpoint="/api/topic"
        render={(data) => {
          return <TopicList topics={data?.topics || []} />
        }}
      />
    </div>
  )
}
