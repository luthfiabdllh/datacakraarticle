"use server"

import { fetchArticles } from "@/lib/api"
import { Article } from "@/types"
import { auth } from "@/auth"

export async function fetchArticlesAction(
    page: number,
    search: string = "",
    category: string = ""
): Promise<Article[]> {
    const session = await auth()
    try {
        const { data } = await fetchArticles({
            page,
            pageSize: 10,
            search,
            category,
        }, session?.user?.jwt)
        return data
    } catch (error) {
        console.error("Error fetching articles:", error)
        return []
    }
}
