"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Subject } from "@prisma/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2).max(50)
})

interface SubjectFormProps {
  subject: Subject
}

export default function EditSubjectForm({ subject }: SubjectFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subject.name
    }
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { name } = values

    const res = await fetch("/api/subject/update", {
      method: "POST",
      body: JSON.stringify({ id: subject.id, name: name.trim() })
    })

    if (!res.ok) {
      toast("Could not update subject")
      return
    }

    toast("Subject updated")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Edit name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
