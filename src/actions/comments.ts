"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createComment(articleId: number, articleDocumentId: string, content: string) {
    const session = await auth()

    if (!session || !session.user || !session.user.jwt) {
        return { error: "You must be logged in to comment." }
    }

    try {
        const res = await fetch(`${API_URL}/api/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.jwt}`,
            },
            body: JSON.stringify({
                data: {
                    content,
                    article: articleId,
                    user: session.user.id,
                },
            }),
        })

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
        const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.jwt}`,
            },
        })

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
        const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.jwt}`,
            },
            body: JSON.stringify({
                data: {
                    content,
                },
            }),
        })

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
