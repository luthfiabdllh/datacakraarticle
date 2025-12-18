"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { useGetMyArticlesQuery, useGetCategoriesQuery } from "@/redux/api"
import { Loader2, FileText, Layers, Plus } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()
    const { data: articlesData, isLoading: isArticlesLoading } = useGetMyArticlesQuery({
        userId: session?.user?.id as number,
        page: 1,
        pageSize: 4 // Fetch 4 for a balanced grid
    }, {
        skip: !session?.user?.id
    })

    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery()

    const totalArticles = articlesData?.meta?.pagination?.total || 0
    const totalCategories = categoriesData?.data?.length || 0
    const recentArticles = articlesData?.data || []

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, <span className="font-semibold text-foreground">{session?.user?.username}</span>! Here&apos;s what&apos;s happening with your content.
                    </p>
                </div>
                <Button asChild className="shrink-0">
                    <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" /> Create New Article
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isArticlesLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="text-2xl font-bold">{totalArticles}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Published across different categories
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Layers className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isCategoriesLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="text-2xl font-bold">{totalCategories}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Active topics available
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Articles</h2>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/my-articles">
                            View All <span className="ml-1">&rarr;</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {isArticlesLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : recentArticles.length > 0 ? (
                        recentArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg bg-muted/20">
                            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No articles yet</h3>
                            <p className="text-muted-foreground text-sm mb-4">Start writing your first article today.</p>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/create">
                                    <Plus className="mr-2 h-4 w-4" /> Create Article
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
