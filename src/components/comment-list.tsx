"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Comment } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CommentItem } from "@/components/comment-item"
import { createComment } from "@/actions/comments"
import { toast } from "sonner"
import { Loader2, MessageSquare } from "lucide-react"
import Link from "next/link"

interface CommentListProps {
    comments: Comment[]
    articleId: number
    articleDocumentId: string
}

export function CommentList({ comments, articleId, articleDocumentId }: CommentListProps) {
    const { data: session } = useSession()
    const [newComment, setNewComment] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    async function handlePostComment() {
        if (!newComment.trim()) return

        setIsPosting(true)
        const result = await createComment(articleId, articleDocumentId, newComment)
        setIsPosting(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Comment posted")
            setNewComment("")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 text-xl font-semibold">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
            </div>

            {/* Post Comment Section */}
            <div className="space-y-4">
                {session ? (
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handlePostComment} disabled={!newComment.trim() || isPosting}>
                                {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post Comment
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 border rounded-lg bg-muted/50 text-center space-y-2">
                        <p className="text-muted-foreground">Please log in to participate in the discussion.</p>
                        <Button variant="outline" asChild>
                            <Link href={`/login?callbackUrl=/articles/${articleDocumentId}`}>Log In</Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} articleDocumentId={articleDocumentId} />
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                )}
            </div>
        </div>
    )
}
