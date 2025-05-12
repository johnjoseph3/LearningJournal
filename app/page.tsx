import TopicList from "@/components/topic-list/topic-list"
import PageHeader from "@/components/page-header/page-header"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default async function Index() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="md:flex">
        <section className="md:w-1/3 w-full mb-4 md:mb-0 md:border-r min-h-[250px]">
          <TopicList heading="My Topics" />
        </section>
        <Separator className="md:hidden w-[1px] bg-gray-200" />
        <section className="md:w-2/3 md:pl-6 w-full min-h-[250px]">
          <TopicList heading="Feed" allPublic={true} />
        </section>
      </div>
    </div>
  )
}
