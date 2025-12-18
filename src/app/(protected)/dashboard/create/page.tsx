"use client"

import { ArticleForm } from "@/components/article-form"
import { useCreateArticleMutation } from "@/redux/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

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
        <div className="space-y-6 container mx-auto max-w-4xl py-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard">
                        <IconArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
                <p className="text-muted-foreground">Share your knowledge and thoughts with the world.</p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                    <CardDescription>Fill in the form below to create your new article.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <ArticleForm onSubmit={onSubmit} isSubmitting={isLoading} />
                </CardContent>
            </Card>
        </div>
    )
}
