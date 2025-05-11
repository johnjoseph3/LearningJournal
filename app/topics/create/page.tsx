"use client"

import { useEffect, useState } from "react"
import { Subject } from "@prisma/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/page-header/page-header"
import Skeleton from "@/components/skeleton"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const formSchema = z
  .object({
    subjectId: z.string().optional(),
    newSubjectName: z.string().optional(),
    topicName: z.string().min(2).max(50),
    createNewSubject: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (data.createNewSubject && !data.newSubjectName) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required to create a new subject",
        path: ["newSubjectName"]
      })
    } else if (!data.createNewSubject && !data.subjectId) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a subject",
        path: ["subjectId"]
      })
    }
  })

function RenderForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      newSubjectName: "",
      topicName: "",
      createNewSubject: true
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/topic/create", {
      method: "POST",
      body: JSON.stringify(values)
    })

    const body = await res.json()

    if (!res.ok) {
      toast(body.message || "Could not create topic")
      return
    }

    const page = body.topic.pages[0]

    router.push(`/pages/${page.userId}/${page.slug}/edit`)
  }

  const createNewSubjectVal = form.getValues("createNewSubject")
  const hasSubjects = subjects.length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="topicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic name</FormLabel>
              <FormControl>
                <Input placeholder="Topic name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="rounded-lg border p-3 shadow-sm">
          <FormField
            control={form.control}
            name="createNewSubject"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 mb-4">
                  <FormLabel>Subject</FormLabel>
                  <FormDescription>Create new subject</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={!hasSubjects}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newSubjectName"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <Input
                    placeholder="New subject name"
                    disabled={!createNewSubjectVal}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem className="mb-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={createNewSubjectVal || !hasSubjects}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select existing subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject: Subject) => {
                      return (
                        <SelectItem
                          key={subject.id}
                          value={subject.id.toString()}
                        >
                          {subject.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!hasSubjects ? (
            <FormDescription>
              No existing Subjects. You must create a new one.
            </FormDescription>
          ) : null}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await fetch("/api/subject")
        const data = await response.json()
        setSubjects(data.subjects)
      } catch (err) {
        console.error("Failed to fetch subjects:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  return (
    <div>
      <PageHeader title="Create Topic" />
      {loading ? <Skeleton /> : <RenderForm subjects={subjects} />}
    </div>
  )
}
