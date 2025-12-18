"use server"

import { fetchArticles } from "@/lib/api"
import { Article } from "@/types"

export async function fetchArticlesAction(
    page: number,
    search: string = "",
    category: string = ""
): Promise<Article[]> {
    try {
        const { data } = await fetchArticles({
            page,
            pageSize: 10,
            search,
            category,
        })
        return data
    } catch (error) {
        console.error("Error fetching articles:", error)
        return []
    }
}
