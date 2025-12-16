import { fetchArticleById } from "@/lib/api"
import { CommentList } from "@/components/comment-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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
    } catch (error) {
        return {
            title: "Article Not Found",
        }
    }
}

export default async function ArticleDetailPage({ params }: PageProps) {
    const { id } = await params
    let article

    try {
        const { data } = await fetchArticleById(id)
        article = data
    } catch (error) {
        notFound()
    }

    return (
        <div className="container py-12 max-w-4xl">
            {/* Article Header */}
            <div className="space-y-6 mb-8">
                <div className="space-y-2">
                    {article.category && (
                        <Badge variant="secondary">{article.category.name}</Badge>
                    )}
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {article.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{article.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{article.user.username}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted mb-10 border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <article className="prose prose-stone dark:prose-invert max-w-none mb-12">
                {/* Simple text rendering for now, can be upgraded to Markdown/Rich Text if API supports it */}
                <p className="whitespace-pre-wrap text-lg leading-relaxed">{article.description}</p>
            </article>

            <hr className="my-12 border-muted" />

            {/* Comments Section */}
            <CommentList
                comments={article.comments}
                articleId={article.id}
                articleDocumentId={article.documentId}
            />
        </div>
    )
}
