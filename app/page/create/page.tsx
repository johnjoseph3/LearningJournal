import ContentForm from "@/components/content-form"

// TODO - when displaying a saved Pge, use tailwind .prose class to style content

export default async function Page() {
    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create Page</h1>
            <ContentForm />
        </div>
    )
}
