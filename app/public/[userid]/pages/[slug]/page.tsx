"use client"

import { useMemo } from "react"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { Entry } from "@prisma/client"
import { generateHTML } from "@tiptap/core"
import { Heading as FontHeading } from "@/components/ui/heading"
import { defaultExtensions } from "@/components/editor/extensions"
import { type JSONContent } from "novel"

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

export default function Page({
  params
}: {
  params: { userid: string; slug: string }
}) {
  const { userid, slug } = params
  const { data, error, isLoading } = useSWR(
    `/api/public/${userid}/pages/${slug}`,
    fetcher
  )

  const htmlContent = useMemo(() => {
    if (data?.page?.entries.length) {
      const html = data.page.entries.reduce((accum: string, curr: Entry) => {
        const content = `<div class="entry hover:bg-secondary rounded-md p-2">
        <div>Created at ${curr.createdAt}</div>
        <div>Updated at ${curr.updatedAt}</div>
        ${generateHTML(curr.content as JSONContent, defaultExtensions)}</div>`
        return accum + " " + content
      }, "")

      return html
    }
  }, [data])

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <>
      <div className="flex justify-between mb-10">
        <FontHeading size="h1" className="capitalize">
          {data.page.topic.name}
        </FontHeading>
        <div>
          <a
            href={`/pages/${slug}/edit`}
            className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit page
          </a>
        </div>
      </div>
      {htmlContent ? (
        <div
          className="prose dark:prose-invert entries-container"
          dangerouslySetInnerHTML={{
            __html: htmlContent || ""
          }}
        />
      ) : null}
    </>
  )
}
