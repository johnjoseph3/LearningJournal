"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"
import TopicList from "@/components/topic-list/topic-list"
import { getFetcher } from "@/app/api/fetchers/get"
import PageHeader from "@/components/page-header/page-header"

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/topic", getFetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <>
      <PageHeader
        title="Topics"
        rightChild={
          <CustomLink href="/topics/create" className="underline block">
            New
          </CustomLink>
        }
      />
      <TopicList topics={data?.topics || []} />
    </>
  )
}
