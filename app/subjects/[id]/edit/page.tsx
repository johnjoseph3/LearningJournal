"use client"

import DataFetcher from "@/components/data-fetcher/data-fetcher"
import EditSubjectForm from "@/components/forms/edit-subject-form"
import { toast } from "sonner"
import PageHeader from "@/components/page-header/page-header"
import { Subject } from "@prisma/client"

async function handleSubmit(id: string, values: { name: string }, mutate: any) {
  const { name } = values

  const res = await fetch("/api/subject/update", {
    method: "POST",
    body: JSON.stringify({ id, name: name.trim() })
  })

  if (!res.ok) {
    toast("Could not update subject")
    return
  }

  toast("Subject updated")

  const body = await res.json()

  mutate({
    subject: body.subject
  })
}

export default function EditSubject({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div>
      <PageHeader title="Subjects" />
      <DataFetcher<{ subject: Subject }>
        endpoint={`/api/subject/${id}`}
        render={(data, mutate) => (
          <EditSubjectForm
            subject={data.subject}
            onSubmit={(values) => handleSubmit(id, values, mutate)}
          />
        )}
      />
    </div>
  )
}
