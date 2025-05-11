"use client"

import CustomLink from "@/components/custom-link"
import CursorPaginator from "@/components/cursor-paginator/cursor-paginator"
import { Subject } from "@prisma/client"
import { Button } from "@/components/ui/button"

interface SubjectListResponse {
  subjects: Subject[]
  nextCursor: string | null
}

export default function SubjectList() {
  return (
    <CursorPaginator<SubjectListResponse>
      endpoint="/api/subject?limit=10"
      mergeData={(currentData, newData) => ({
        subjects: [...currentData.subjects, ...newData.subjects],
        nextCursor: newData.nextCursor
      })}
      getNextCursor={(data) => data.nextCursor}
      render={(data, loadMore, loading, hasMore) => {
        return (
          <div>
            {data.subjects.map((subject) => (
              <CustomLink
                key={subject.id}
                href={`/subjects/${subject.id}/edit`}
                className="underline block"
              >
                {subject.name}
              </CustomLink>
            ))}

            {!data.subjects.length && !loading && (
              <>
                <span className="text-gray-500">No subjects found </span>
                <CustomLink href="/topics/create" className="underline">
                  create a new topic and subject
                </CustomLink>
              </>
            )}

            {hasMore && (
              <Button onClick={loadMore} disabled={loading} className="mt-4">
                {loading ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        )
      }}
    />
  )
}
