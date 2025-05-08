"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import CustomLink from "@/components/custom-link"
import { Subject } from "@prisma/client"
import { getFetcher } from "@/app/api/fetchers/get"
import PageHeader from "@/components/page-header/page-header"

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/subject", getFetcher)

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  return (
    <>
      <PageHeader title="Subjects" />
      {data.subjects.map((subject: Subject) => {
        return (
          <CustomLink
            key={subject.id}
            href={`/subjects/${subject.id}/edit`}
            className="underline block"
          >
            {subject.name}
          </CustomLink>
        )
      })}
      {!data.subjects.length ? (
        <>
          <span className="text-gray-500">No subjects found </span>
          <CustomLink href="/topics/create" className="underline">
            create a new topic and subject
          </CustomLink>
        </>
      ) : null}
    </>
  )
}
