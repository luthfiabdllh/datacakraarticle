import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { Article } from "@/types"

interface FeaturedArticlesProps {
    articles: Article[]
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Featured Articles
                    </h2>
                    <Button variant="ghost" asChild className="group">
                        <Link href="/articles" className="flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </section>
    )
}
