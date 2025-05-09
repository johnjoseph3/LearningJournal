"use client"

import CustomLink from "@/components/custom-link"
import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"
import DataFetcher from "@/components/data-fetcher/data-fetcher"
import { Topic } from "@prisma/client"

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Topics"
        rightChild={
          <CustomLink href="/topics/create" className="underline block">
            New
          </CustomLink>
        }
      />
      <DataFetcher<{ topics: Topic[] }>
        endpoint="/api/topic"
        render={(data) => {
          return <TopicList topics={data?.topics || []} />
        }}
      />
    </div>
  )
}
