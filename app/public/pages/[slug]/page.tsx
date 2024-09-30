"use client"

import { useMemo } from "react"
import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { Entry } from "@prisma/client"
import { generateHTML } from "@tiptap/core"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Bold from "@tiptap/extension-bold"
import Heading from "@tiptap/extension-heading"
import ListItem from "@tiptap/extension-list-item"
import BulletList from "@tiptap/extension-bullet-list"
import Link from "@tiptap/extension-link"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import OrderedList from "@tiptap/extension-ordered-list"
import BlockQuote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"

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

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { data, error, isLoading } = useSWR(
    `/api/page/find-public/${slug}`,
    fetcher
  )

  const htmlContent = useMemo(() => {
    if (data?.page?.entries.length) {
      const html = data.page.entries.reduce((accum: string, curr: Entry) => {
        const content = generateHTML(curr.content as JSONContent, [
          Document,
          Paragraph,
          Text,
          Bold,
          Heading,
          ListItem,
          BulletList,
          Link,
          TaskList,
          TaskItem,
          OrderedList,
          BlockQuote,
          CodeBlock
        ])
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
        <div>
          <h1 className="font-bold leading-tight text-3xl capitalize">
            {data.page.slug}
          </h1>
          <p className="text-muted-foreground">{data.page.topic.name}</p>
        </div>
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
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: htmlContent || ""
          }}
        />
      ) : null}
    </>
  )
}
