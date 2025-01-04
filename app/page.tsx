"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { Heading } from "@/components/ui/heading"
import { getFetcher } from "@/app/api/fetchers/get"
import TopicList from "@/components/topic-list/topic-list"

export default function Index() {
  const { data, error, isLoading } = useSWR("/api/topic", getFetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <div>
      <Heading size="h3">Your topics</Heading>
      <TopicList topics={data?.topics || []} />
    </div>
  )
}
