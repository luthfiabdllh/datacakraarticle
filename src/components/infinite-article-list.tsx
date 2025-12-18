"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Article } from "@/types"
import { ArticleCard } from "@/components/article-card"
import { fetchArticlesAction } from "@/actions/articles"
import { Loader2 } from "lucide-react"

interface InfiniteArticleListProps {
    initialArticles: Article[]
    search?: string
    category?: string
}

export function InfiniteArticleList({ initialArticles, search = "", category = "" }: InfiniteArticleListProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const { ref, inView } = useInView()

    // Reset state when search or category changes
    useEffect(() => {
        setArticles(initialArticles)
        setPage(1)
        setHasMore(true) // Reset hasMore to allow checking for next page
        // Specifically for initial load, if initialArticles is empty or small, hasMore might need adjustment,
        // but typically we assume page 1 implies potentia more unless length < pageSize (10).
        if (initialArticles.length < 10) {
            setHasMore(false)
        }
    }, [initialArticles, search, category])

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreArticles()
        }
    }, [inView, hasMore, loading])

    async function loadMoreArticles() {
        setLoading(true)
        const nextPage = page + 1
        // Artificial delay for smooth UX if needed, but not strictly required
        // await new Promise(resolve => setTimeout(resolve, 500)) 

        const newArticles = await fetchArticlesAction(nextPage, search, category)

        if (newArticles.length === 0) {
            setHasMore(false)
        } else {
            setArticles((prev) => [...prev, ...newArticles])
            setPage(nextPage)
            if (newArticles.length < 10) {
                setHasMore(false)
            }
        }
        setLoading(false)
    }

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <ArticleCard key={`${article.id}-${article.documentId}`} article={article} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No articles found matching your criteria.
                    </div>
                )}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center py-8">
                    <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
                </div>
            )}

            {!hasMore && articles.length > 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    You have reached the end of the list.
                </div>
            )}
        </>
    )
}
