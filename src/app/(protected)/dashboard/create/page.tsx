"use client"

import { ArticleForm } from "@/components/article-form"
import { useCreateArticleMutation } from "@/redux/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateArticlePage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [createArticle, { isLoading }] = useCreateArticleMutation()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onSubmit(values: any) {
        if (!session?.user?.id) return

        try {
            await createArticle({
                ...values,
                category: parseInt(values.category),
                user: session.user.id,
            }).unwrap()

            toast.success("Article created successfully!")
            router.push("/dashboard/my-articles")
        } catch {
            toast.error("Failed to create article.")
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
            <div className="max-w-2xl">
                <ArticleForm onSubmit={onSubmit} isSubmitting={isLoading} />
            </div>
        </div>
    )
}
