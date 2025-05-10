import { prisma } from "@/prisma/prisma"
import PageHeader from "@/components/page-header/page-header"
import CustomLink from "@/components/custom-link"
import { Subject } from "@prisma/client"
import { auth } from "auth"

async function fetchSubjects(): Promise<Subject[]> {
  const session = await auth()
  if (!session?.user) {
    return []
  }

  return await prisma.subject.findMany({
    where: {
      userId: session.user.id
    }
  })
}

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

export default async function Page() {
  const subjects = await fetchSubjects()

  return (
    <div>
      <PageHeader title="Subjects" />
      <RenderSubjects subjects={subjects} />
    </div>
  )
}
