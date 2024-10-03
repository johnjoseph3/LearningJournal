"use client"

import Skeleton from "@/components/skeleton"
import useSWR from "swr"
import EditCategoryForm from "@/components/forms/edit-category-form"
import { toast } from "sonner"
import { Heading } from "@/components/ui/heading"

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

export default function EditCategory({ params }: { params: { id: string } }) {
  const { id } = params

  const { data, error, isLoading, mutate } = useSWR(
    `/api/topic-category/${id}`,
    fetcher
  )

  if (error)
    return error?.info?.message || "An error occurred while fetching the data."

  if (isLoading) return <Skeleton />

  async function handleSubmit(values: { name: string }) {
    const { name } = values

    const res = await fetch("/api/topic-category/update", {
      method: "POST",
      body: JSON.stringify({ id, name: name.trim() })
    })

    if (!res.ok) {
      toast("Could not update category")
      return
    }

    toast("Category updated")

    const body = await res.json()

    mutate({
      category: body.category
    })
  }

  return (
    <>
      <Heading size="h1">Edit category</Heading>
      <EditCategoryForm category={data.category} onSubmit={handleSubmit} />
    </>
  )
}
