import CustomLink from "@/components/custom-link"
import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"

export default async function Page() {
  return (
    <div>
      <PageHeader
        title="Topics"
        rightChild={
          <CustomLink href="/topics/create" className="underline block">
            New
          </CustomLink>
        }
      />
      <TopicList />
    </div>
  )
}
