"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"

interface DataFetcherProps<T> {
  endpoint: string
  render: (
    data: T,
    mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => void
  ) => React.ReactNode
}

export default function DataFetcher<T>({
  endpoint,
  render
}: DataFetcherProps<T>) {
  const { data, error, isLoading, mutate } = useSWR(endpoint, (url) =>
    fetch(url).then((res) => res.json())
  )

  if (error)
    return (
      <div>
        {error?.info?.message || "An error occurred while fetching the data."}
      </div>
    )

  if (isLoading) return <Skeleton />

  return <>{data && render(data, mutate)}</>
}
