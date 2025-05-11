"use client"

import PageHeader from "@/components/page-header/page-header"
import SubjectList from "@/components/subject-list/subject-list"

export default function Page() {
  return (
    <div>
      <PageHeader title="Subjects" />
      <SubjectList />
    </div>
  )
}
