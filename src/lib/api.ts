import { ApiResponse, Article, Category } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchArticles(searchParams?: {
    page?: number
    pageSize?: number
    search?: string
    category?: string
}): Promise<ApiResponse<Article[]>> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const params = new URLSearchParams()
    params.append("populate", "*")

    // Pagination
    if (searchParams?.page) params.append("pagination[page]", searchParams.page.toString())
    if (searchParams?.pageSize) params.append("pagination[pageSize]", searchParams.pageSize.toString())

    // Search
    if (searchParams?.search) {
        params.append("filters[title][$eqi]", searchParams.search)
    }

    // Filter Category
    if (searchParams?.category) {
        params.append("filters[category][name][$eqi]", searchParams.category)
    }

    const res = await fetch(`${API_URL}/api/articles?${params.toString()}`, {
        cache: "no-store", // Ensure fresh data for listings
    })

    if (!res.ok) {
        throw new Error("Failed to fetch articles")
    }

    return res.json()
}

export async function fetchCategories(): Promise<ApiResponse<Category[]>> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const res = await fetch(`${API_URL}/api/categories`, {
        next: { revalidate: 3600 }, // Cache categories for 1 hour
    })

    if (!res.ok) {
        throw new Error("Failed to fetch categories")
    }

    return res.json()
}

export async function fetchArticleById(id: string): Promise<ApiResponse<Article>> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const res = await fetch(`${API_URL}/api/articles/${id}?populate[comments][populate][user]=*&populate[user]=*&populate[category]=*`, {
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch article")
    }

    return res.json()
}
