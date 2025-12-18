"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { useGetMyArticlesQuery, useGetCategoriesQuery } from "@/redux/api/apiSlice"
import { Loader2, FileText, Layers, Plus } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()
    const { data: articlesData, isLoading: isArticlesLoading } = useGetMyArticlesQuery({
        userId: session?.user?.id as number,
        page: 1,
        pageSize: 5 // Fetch only recent 5 for overview
    }, {
        skip: !session?.user?.id
    })

    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

    const totalArticles = articlesData?.meta?.pagination?.total || 0
    const totalCategories = categoriesData?.data?.length || 0
    const recentArticles = articlesData?.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {session?.user?.username}! Here's an overview of your content.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Article
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isArticlesLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="text-2xl font-bold">{totalArticles}</div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Published articles
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isCategoriesLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="text-2xl font-bold">{totalCategories}</div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Active categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Articles</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isArticlesLoading ? (
                        <div className="col-span-full flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : recentArticles.length > 0 ? (
                        recentArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg border-dashed text-muted-foreground">
                            No articles yet. Create your first one!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
