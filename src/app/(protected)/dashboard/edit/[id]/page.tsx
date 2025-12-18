"use client"

import { ArticleForm } from "@/components/article-form"
import { useGetArticleByIdQuery, useUpdateArticleMutation } from "@/redux/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    // React.use() to unwrap params in Next.js 15+ (using Promise type)
    const { id } = React.use(params)

    const { data: articleData, isLoading: isLoadingArticle } = useGetArticleByIdQuery(id)
    const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onSubmit(values: any) {
        if (!articleData?.data?.id) return

        try {
            await updateArticle({
                id: articleData.data.documentId,
                data: {
                    ...values,
                    category: parseInt(values.category),
                },
            }).unwrap()

            toast.success("Article updated successfully!")
            router.push("/dashboard/my-articles")
        } catch {
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
        <div className="space-y-6 container mx-auto max-w-4xl py-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard/my-articles">
                        <IconArrowLeft className="mr-1 h-4 w-4" /> Back to My Articles
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
                <p className="text-muted-foreground">Update your article content and settings.</p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                    <CardDescription>Make changes to your article below.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <ArticleForm
                        initialData={articleData.data}
                        onSubmit={onSubmit}
                        isSubmitting={isUpdating}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
