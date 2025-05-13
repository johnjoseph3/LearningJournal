import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"

export default async function Index() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="flex flex-col md:flex-row">
        <section className="w-full md:w-1/3 md:border-r order-2 md:order-1">
          <TopicList heading="My Topics" />
        </section>
        <section className="w-full md:w-2/3 md:pl-6 order-1 md:order-2 pb-4 md:pb-0 border-b md:border-b-0">
          <TopicList heading="Feed" allPublic={true} />
        </section>
      </div>
    </div>
  )
}
