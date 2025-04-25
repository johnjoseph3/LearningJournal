"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import { TopicCategory } from "@prisma/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
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

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

const formSchema = z
  .object({
    categoryId: z.string().optional(),
    newCategoryName: z.string().optional(),
    topicName: z.string().min(2).max(50),
    createNewCategory: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (data.createNewCategory && !data.newCategoryName) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required to create a new category",
        path: ["newCategoryName"]
      })
    } else if (!data.createNewCategory && !data.categoryId) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a category",
        path: ["categoryId"]
      })
    }
  })

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/topic-category", fetcher)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      newCategoryName: "",
      topicName: "",
      createNewCategory: true
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

    router.push(`/pages/${page.slug}/edit`)
  }

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  const createNewCategoryVal = form.getValues("createNewCategory")
  const hasTopicCategories = data.topicCategories.length

  return (
    <>
      <Heading size="h1">New topic</Heading>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
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
              name="createNewCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5 mb-4">
                    <FormLabel>Category</FormLabel>
                    <FormDescription>Create new category</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!hasTopicCategories}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newCategoryName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input
                      placeholder="New category name"
                      disabled={!createNewCategoryVal}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={createNewCategoryVal || !hasTopicCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select existing category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.topicCategories.map((category: TopicCategory) => {
                        return (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!hasTopicCategories ? (
              <FormDescription>
                No existing categories. You must create a new one.
              </FormDescription>
            ) : null}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}
