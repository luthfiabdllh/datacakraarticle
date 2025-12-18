"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { postCommentApi, deleteCommentApi, updateCommentApi } from "@/lib/api/comments"

export async function createComment(articleId: number, articleDocumentId: string, content: string) {
    const session = await auth()

    if (!session || !session.user || !session.user.jwt) {
        return { error: "You must be logged in to comment." }
    }

    try {
        const res = await postCommentApi(session.user.id, articleId, content, session.user.jwt)
        const data = await res.json()

        if (!res.ok) {
            return { error: data.error?.message || "Failed to post comment." }
        }

        revalidatePath(`/articles/${articleDocumentId}`)
        return { success: true }
    } catch {
        return { error: "Something went wrong." }
    }
}

export async function deleteComment(commentId: string, articleDocumentId: string) {
    const session = await auth()

    if (!session || !session.user || !session.user.jwt) {
        return { error: "Unauthorized" }
    }

    try {
        const res = await deleteCommentApi(commentId, session.user.jwt)
        const data = await res.json()

        if (!res.ok) {
            return { error: data.error?.message || "Failed to delete comment." }
        }

        revalidatePath(`/articles/${articleDocumentId}`)
        return { success: true }
    } catch {
        return { error: "Something went wrong." }
    }
}

export async function updateComment(commentId: string, articleDocumentId: string, content: string) {
    const session = await auth()

    if (!session || !session.user || !session.user.jwt) {
        return { error: "Unauthorized" }
    }

    try {
        const res = await updateCommentApi(commentId, content, session.user.jwt)
        const data = await res.json()

        if (!res.ok) {
            return { error: data.error?.message || "Failed to update comment." }
        }

        revalidatePath(`/articles/${articleDocumentId}`)
        return { success: true }
    } catch {
        return { error: "Something went wrong." }
    }
}
