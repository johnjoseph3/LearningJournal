"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/topic", fetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  const groupedTopics = data.topics.reduce((accum: any, curr: any) => {
    if (!accum[curr.category.name]) {
      accum[curr.category.name] = [curr]
    } else {
      accum[curr.category.name].push(curr)
    }
    return accum
  }, {})

  return (
    <>
      <div className="flex justify-between">
        <Heading size="h1" className="mb-10">
          Topics
        </Heading>
        <div className="flex items-center">
          <CustomLink href="/topics/create" className="underline block">
            New
          </CustomLink>
        </div>
      </div>
      {Object.keys(groupedTopics).map((keyName, i) => {
        const topics = groupedTopics[keyName]
        return (
          <div key={i} className="mb-4">
            <Heading size="h3" className="font-normal">
              {keyName}
            </Heading>
            {topics.map((topic: any) => {
              const page = topic.page[0]
              const url = page.public
                ? `/public/${page.userId}/pages/${page.slug}`
                : `/pages/${page.slug}/edit`

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
    </>
  )
}
