import Link from "next/link"
import { Article } from "@/types"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface ArticleCardProps {
    article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/articles/${article.documentId}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:hover:border-primary/50 group">
                <div className="aspect-video w-full overflow-hidden relative bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {article.category && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                            {article.category.name}
                        </Badge>
                    )}
                </div>
                <CardHeader className="p-4">
                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight">
                        {article.title}
                    </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {article.description}
                    </p>
                </CardContent>
                <div className="p-4 pt-0 text-sm text-muted-foreground flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span className="truncate max-w-[100px]">{article.user?.username || "Unknown Author"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{article.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(new Date(article.publishedAt), "MMM d, yyyy")}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
