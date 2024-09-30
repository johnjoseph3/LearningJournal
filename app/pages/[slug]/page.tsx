"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"

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

export default function Page({ params }: { params: { slug: string } }) {
  const { data, error, isLoading } = useSWR(
    `/api/page/find-one/${params.slug}`,
    fetcher
  )

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  // display all content as html

  return (
    <div>
      {
        // data.page.entries.map(entry => {
        //     return
        // })
      }
    </div>
  )
}
