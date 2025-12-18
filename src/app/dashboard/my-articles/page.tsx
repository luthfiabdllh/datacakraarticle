"use client"

import { useSession } from "next-auth/react"
import { useGetMyArticlesQuery, useDeleteArticleMutation } from "@/redux/api/apiSlice"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import Link from "next/link"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function MyArticlesPage() {
    const { data: session } = useSession()
    const { data: articlesData, isLoading } = useGetMyArticlesQuery({
        userId: session?.user?.id as number,
    }, {
        skip: !session?.user?.id
    })

    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation()
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!articleToDelete) return
        try {
            await deleteArticle(articleToDelete).unwrap()
            toast.success("Article deleted successfully")
            setArticleToDelete(null)
        } catch {
            toast.error("Failed to delete article")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
                <Button asChild>
                    <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Published At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : articlesData?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No articles found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articlesData?.data.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>{article.category?.name || "-"}</TableCell>
                                    <TableCell>{format(new Date(article.publishedAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/edit/${article.documentId}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <Dialog open={articleToDelete === article.documentId} onOpenChange={(open) => !open && setArticleToDelete(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setArticleToDelete(article.documentId)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Article</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete this article? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setArticleToDelete(null)}>Cancel</Button>
                                                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
