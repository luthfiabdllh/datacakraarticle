import { fetchArticles, fetchCategories } from "@/lib/api"
import { InfiniteArticleList } from "@/components/infinite-article-list"
import { SearchFilter } from "@/components/search-filter"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{
        search?: string
        category?: string
        page?: string
    }>
}

export default async function ArticlesPage(props: PageProps) {
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1
    const search = searchParams?.search || ""
    const category = searchParams?.category || ""

    const { data: articles } = await fetchArticles({
        page: currentPage,
        pageSize: 10,
        search,
        category
    })

    // Fetch categories for the filter
    const { data: categories } = await fetchCategories()

    return (
        <div className="container py-12">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Explore Articles</h1>
                <p className="text-muted-foreground">
                    Find topics that interest you from our collection.
                </p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
                <SearchFilter categories={categories} />
            </Suspense>

            <InfiniteArticleList
                initialArticles={articles}
                search={search}
                category={category}
            />
        </div>
    )
}
