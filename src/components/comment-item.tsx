"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Comment } from "@/types"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { deleteComment, updateComment } from "@/actions/comments"
import { Edit2, Loader2, Trash2 } from "lucide-react"

interface CommentItemProps {
    comment: Comment
    articleDocumentId: string
}

export function CommentItem({ comment, articleDocumentId }: CommentItemProps) {
    const { data: session } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Ensure type safety when comparing IDs
    // Ensure type safety when comparing IDs
    // Strict check: Session MUST exist, and either email or ID must match
    const isOwner = !!session?.user && (
        (!!session.user.email && session.user.email === comment.user?.email) ||
        (!!session.user.id && !!comment.user?.id && String(session.user.id) === String(comment.user.id))
    );

    async function handleUpdate() {
        if (!editContent.trim()) return
        setIsLoading(true)
        const result = await updateComment(comment.documentId, articleDocumentId, editContent)
        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Comment updated")
            setIsEditing(false)
        }
    }

    async function handleDelete() {
        setIsLoading(true)
        const result = await deleteComment(comment.documentId, articleDocumentId)
        setIsLoading(false)
        setIsDeleteDialogOpen(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Comment deleted")
        }
    }

    return (
        <div className="flex gap-4 p-4 border rounded-lg bg-card text-card-foreground">
            <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{comment.user?.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{comment.user?.username || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.publishedAt), "MMM d, yyyy HH:mm")}
                        </span>
                    </div>
                    {isOwner && !isEditing && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Comment</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this comment? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[80px]"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdate} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                )}
            </div>
        </div>
    )
}
