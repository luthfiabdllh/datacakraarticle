"use client"

import { useSession } from "next-auth/react"
import { useGetMyArticlesQuery, useDeleteArticleMutation, useGetCategoriesQuery } from "@/redux/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Edit, Trash2, Plus, Loader2, Search } from "lucide-react"
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
import { useState, useEffect } from "react"

export default function MyArticlesPage() {
    const { data: session } = useSession()

    // State for filtering
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const { data: categoriesData } = useGetCategoriesQuery()

    // Pass filters to query
    const { data: articlesData, isLoading } = useGetMyArticlesQuery({
        userId: session?.user?.id as number,
        search: debouncedSearch,
        category: selectedCategory,
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
                <Button asChild>
                    <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search articles..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[200px] bg-background">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoriesData?.data?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md bg-card">
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
                                    {searchTerm || selectedCategory !== "all" ? (
                                        "No articles found matching your filters."
                                    ) : (
                                        "No articles found. Create one to get started."
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            articlesData?.data.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {article.category?.name || "Uncategorized"}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(article.publishedAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/edit/${article.documentId}`}>
                                                    <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                </Link>
                                            </Button>

                                            <Dialog open={articleToDelete === article.documentId} onOpenChange={(open) => !open && setArticleToDelete(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setArticleToDelete(article.documentId)}>
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
