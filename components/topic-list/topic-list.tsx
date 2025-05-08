import { Topic } from "@prisma/client"
import CustomLink from "@/components/custom-link"
import { Heading } from "@/components/ui/heading"

interface TopicListProps {
  topics: Topic[]
}

export default function TopicList({ topics }: TopicListProps) {
  const groupedTopics = topics.reduce((accum: any, curr: any) => {
    if (!accum[curr.subject.name]) {
      accum[curr.subject.name] = [curr]
    } else {
      accum[curr.subject.name].push(curr)
    }
    return accum
  }, {})

  return (
    <>
      {Object.keys(groupedTopics).map((keyName, i) => {
        const topics = groupedTopics[keyName]
        return (
          <div key={i} className="mb-4">
            <Heading size="h3" className="font-normal mb-2">
              {keyName}
            </Heading>
            {topics.map((topic: any) => {
              const page = topic.page[0]
              const url = page.public
                ? `/public/${page.userId}/pages/${page.slug}`
                : `/pages/${page.userId}/${page.slug}/edit`


              return (
                <CustomLink
                  key={topic.id}
                  href={url}
                  className="underline block"
                >
                  {topic.name}
                </CustomLink>
              )
            })}
          </div>
        )
      })}
      {!topics.length ? (
        <>
          <span className="text-gray-500">No topics found </span>
          <CustomLink href="/topics/create" className="underline">
            create a new one
          </CustomLink>
        </>
      ) : null}
    </>
  )
}
