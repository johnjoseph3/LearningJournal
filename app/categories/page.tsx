"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import CustomLink from "@/components/custom-link"
import { TopicCategory } from "@prisma/client"
import { getFetcher } from "@/app/api/fetchers/get"
import PageHeader from "@/components/page-header/page-header"

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/topic-category", getFetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <>
      <PageHeader title="Categories" />
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
