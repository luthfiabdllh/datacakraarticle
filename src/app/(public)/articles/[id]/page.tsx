import { fetchArticleById, fetchArticles } from "@/lib/api"
import { ArticleCard } from "@/components/article-card"
import { CommentList } from "@/components/comment-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CalendarIcon, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { id } = await params
        const { data: article } = await fetchArticleById(id)

        return {
            title: `${article.title} | Datacakra Feeds`,
            description: article.description,
            openGraph: {
                title: article.title,
                description: article.description,
                images: [{ url: article.cover_image_url }],
            },
        }
    } catch {
        return {
            title: "Article Not Found",
        }
    }
}

export default async function ArticleDetailPage({ params }: PageProps) {
    const { id } = await params
    const session = await auth()
    let article

    try {
        const { data } = await fetchArticleById(id, session?.user?.jwt)
        article = data
    } catch {
        notFound()
    }

    const { data: recommendedArticles } = await fetchArticles({ pageSize: 4 }, session?.user?.jwt)

    return (
        <section className="container py-32">
            <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
                <aside className="top-10 h-fit flex-shrink-0 lg:sticky lg:w-[300px] xl:w-[400px]">
                    <a
                        className="mb-5 flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        href="/"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Return to home
                    </a>
                    {article.category && (
                        <div className="mb-4">
                            <Badge variant="secondary">{article.category.name}</Badge>
                        </div>
                    )}
                    <h1 className="mb-5 text-3xl font-bold text-balance lg:text-4xl text-foreground">
                        {article.title}
                    </h1>
                    <div className="flex gap-3 items-center">
                        <Avatar className="size-10 rounded-full border">
                            <AvatarImage src="" />
                            <AvatarFallback>{article.user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold text-sm">{article.user?.username || "Unknown Author"}</h2>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                </aside>

                <article className="lg:flex-1 lg:max-w-3xl">
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted mb-8 border shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="prose prose-stone dark:prose-invert max-w-none mb-12">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">{article.description}</p>
                    </div>

                    <hr className="my-12 border-muted" />

                    <CommentList
                        comments={article.comments}
                        articleId={article.id}
                        articleDocumentId={article.documentId}
                    />

                    <hr className="my-12 border-muted" />

                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold tracking-tight">Recommended Articles</h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {recommendedArticles.filter(a => a.documentId !== article.documentId).slice(0, 2).map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    )
}
