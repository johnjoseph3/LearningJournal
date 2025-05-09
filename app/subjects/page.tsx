"use client"

import CustomLink from "@/components/custom-link"
import PageHeader from "@/components/page-header/page-header"
import DataFetcher from "@/components/data-fetcher/data-fetcher"
import { Subject } from "@prisma/client"

function RenderSubjects({ subjects }: { subjects: Subject[] }) {
  return (
    <>
      {subjects.map((subject) => (
        <CustomLink
          key={subject.id}
          href={`/subjects/${subject.id}/edit`}
          className="underline block"
        >
          {subject.name}
        </CustomLink>
      ))}
      {!subjects.length && (
        <>
          <span className="text-gray-500">No subjects found </span>
          <CustomLink href="/topics/create" className="underline">
            create a new topic and subject
          </CustomLink>
        </>
      )}
    </>
  )
}

export default function Page() {
  return (
    <div>
      <PageHeader title="Subjects" />
      <DataFetcher<{ subjects: Subject[] }>
        endpoint="/api/subject"
        render={(data) => <RenderSubjects subjects={data.subjects} />}
      />
    </div>
  )
}
