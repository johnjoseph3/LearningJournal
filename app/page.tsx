import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"

export default async function Index() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <TopicList />
    </div>
  )
}
