"use client"

import { Topic } from "@prisma/client"
import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"
import DataFetcher from "@/components/data-fetcher/data-fetcher"

interface TopicListResponse {
  topics: Topic[]
  nextCursor: string | null
}

export default function TopicList() {
  return (
    <DataFetcher<TopicListResponse>
      endpoint="/api/topic?limit=10"
      mergeData={(currentData, newData) => ({
        topics: [...currentData.topics, ...newData.topics],
        nextCursor: newData.nextCursor
      })}
      getNextCursor={(data) => data.nextCursor}
      render={(data, loadMore, loading, hasMore) => {
        // Group topics by subject name
        const groupedTopics = data.topics.reduce((accum: any, curr: any) => {
          if (!accum[curr.subject.name]) {
            accum[curr.subject.name] = [curr]
          } else {
            accum[curr.subject.name].push(curr)
          }
          return accum
        }, {})

        return (
          <div>
            {Object.keys(groupedTopics).map((keyName, i) => {
              const topics = groupedTopics[keyName]
              return (
                <div key={i} className="mb-4">
                  <Heading size="h3" className="font-normal mb-2">
                    {keyName}
                  </Heading>
                  {topics.map((topic: any) => {
                    const page = topic.page[0]
                    const url = page.public
                      ? `/public/${page.userId}/pages/${page.slug}`
                      : `/pages/${page.userId}/${page.slug}/edit`

                    return (
                      <CustomLink
                        key={topic.id}
                        href={url}
                        className="underline block"
                      >
                        {topic.name}
                      </CustomLink>
                    )
                  })}
                </div>
              )
            })}

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )
      }}
    />
  )
}
