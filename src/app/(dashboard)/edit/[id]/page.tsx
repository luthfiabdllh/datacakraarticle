"use client"

import { ArticleForm } from "@/components/article-form"
import { useGetArticleByIdQuery, useUpdateArticleMutation } from "@/redux/api/apiSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import React from "react"

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    // React.use() to unwrap params in Next.js 15+ (using Promise type)
    // But due to client component limits with async params in older/stable pattern, using React.use() or await in server parent is safer. 
    // As this is a client component page in app router, let's use React.use() if available or standard props. 
    // Given Next.js 15/16 changes, `params` is a Promise.
    // We'll trust the standard unwrapping for now or handle it via a wrapper.
    // Actually, let's just use `use` from react if available in this environment (Next 16).

    const { id } = React.use(params)

    const { data: articleData, isLoading: isLoadingArticle } = useGetArticleByIdQuery(id)
    const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation()

    async function onSubmit(values: any) {
        if (!articleData?.data?.id) return

        try {
            await updateArticle({
                id: articleData.data.id,
                data: {
                    ...values,
                    category: parseInt(values.category),
                },
            }).unwrap()

            toast.success("Article updated successfully!")
            router.push("/dashboard/my-articles")
        } catch (error) {
            toast.error("Failed to update article.")
        }
    }

    if (isLoadingArticle) {
        return <div className="flex h-60 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!articleData?.data) {
        return <div>Article not found</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
            <div className="max-w-2xl">
                <ArticleForm
                    initialData={articleData.data}
                    onSubmit={onSubmit}
                    isSubmitting={isUpdating}
                />
            </div>
        </div>
    )
}
