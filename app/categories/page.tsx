"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"
import { TopicCategory } from "@prisma/client"

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
  const { data, error, isLoading } = useSWR("/api/topic-category", fetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <>
      <div className="flex justify-between">
        <Heading size="h1" className="mb-10">
          Categories
        </Heading>
      </div>
      {data.topicCategories.map((category: TopicCategory) => {
        return (
          <CustomLink
            key={category.id}
            href={`/categories/${category.id}/edit`}
            className="underline block"
          >
            {category.name}
          </CustomLink>
        )
      })}
      {!data.topicCategories.length ? (
        <>
          <span className="text-gray-500">No categories found </span>
          <CustomLink href="/topics/create" className="underline">
            create a new topic and category
          </CustomLink>
        </>
      ) : null}
    </>
  )
}
