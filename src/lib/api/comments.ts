const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function postCommentApi(userId: number, articleId: number, content: string, token: string) {
    const res = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                content,
                article: articleId,
                user: userId,
            },
        }),
    })
    return res
}

export async function deleteCommentApi(commentId: string, token: string) {
    const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return res
}

export async function updateCommentApi(commentId: string, content: string, token: string) {
    const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                content,
            },
        }),
    })
    return res
}
