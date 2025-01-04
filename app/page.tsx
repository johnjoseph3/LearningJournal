"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { getFetcher } from "@/app/api/fetchers/get"
import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"

export default function Index() {
  const { data, error, isLoading } = useSWR("/api/topic", getFetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <div>
      <PageHeader title="Dashboard" />
      <TopicList topics={data?.topics || []} />
    </div>
  )
}
