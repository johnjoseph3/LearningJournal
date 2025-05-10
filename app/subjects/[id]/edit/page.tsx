import EditSubjectForm from "@/components/forms/edit-subject-form"
import PageHeader from "@/components/page-header/page-header"
import { Subject } from "@prisma/client"
import { prisma } from "@/prisma/prisma"

async function fetchSubject(id: string): Promise<Subject | null> {
  return await prisma.subject.findUnique({
    where: {
      id: parseInt(id)
    }
  })
}

export default async function EditSubject({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const subject = await fetchSubject(id)

  if (!subject) {
    return <div>Could not find subject</div>
  }

  return (
    <div>
      <PageHeader title="Subjects" />
      <EditSubjectForm subject={subject} />
    </div>
  )
}
