"use client"

import CustomLink from "@/components/custom-link"
import CursorPaginator from "@/components/cursor-paginator/cursor-paginator"
import { Button } from "@/components/ui/button"
import { Prisma } from "@prisma/client"
import { Heading } from "@/components/ui/heading"

type TopicWithRelations = Prisma.TopicGetPayload<{
  include: { page: true; subject: true }
}>

interface TopicListResponse {
  topics: TopicWithRelations[]
  nextCursor: string | null
}

export default function TopicList(props: {
  allPublic?: boolean
  heading?: string
}) {
  const { allPublic, heading } = props
  const endpoint = `/api/topic?limit=10${allPublic ? "&allPublic=true" : ""}`

  return (
    <CursorPaginator<TopicListResponse>
      endpoint={endpoint}
      mergeData={(currentData, newData) => ({
        topics: [...currentData.topics, ...newData.topics],
        nextCursor: newData.nextCursor
      })}
      getNextCursor={(data) => data.nextCursor}
      render={(data, loadMore, loading, hasMore) => {
        return (
          <div>
            {heading && (
              <Heading size="h2" className="font-normal">
                {heading}
              </Heading>
            )}
            <ul>
              {data.topics.map((topic) => {
                const page = topic.page[0]
                const url = page.public
                  ? `/public/${page.userId}/pages/${page.slug}`
                  : `/pages/${page.userId}/${page.slug}/edit`

                return (
                  <li key={topic.id} className="mt-2">
                    <CustomLink href={url}>{topic.name}</CustomLink>
                  </li>
                )
              })}
            </ul>

            {!data.topics.length && !loading && (
              <>
                <span className="text-gray-500">No topics found </span>
                <CustomLink href="/topics/create" className="underline">
                  create a new topic
                </CustomLink>
              </>
            )}

            {hasMore && (
              <Button onClick={loadMore} disabled={loading} className="mt-4">
                {loading ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        )
      }}
    />
  )
}
