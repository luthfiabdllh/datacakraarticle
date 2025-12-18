import { ApiResponse, Article, Category } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchArticles(searchParams?: {
    page?: number
    pageSize?: number
    search?: string
    category?: string
}, token?: string): Promise<ApiResponse<Article[]>> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const params = new URLSearchParams()
    params.append("populate", "*")

    // Pagination
    if (searchParams?.page) params.append("pagination[page]", searchParams.page.toString())
    if (searchParams?.pageSize) params.append("pagination[pageSize]", searchParams.pageSize.toString())

    // Search
    if (searchParams?.search) {
        params.append("filters[title][$containsi]", searchParams.search)
    }

    // Filter Category
    if (searchParams?.category) {
        params.append("filters[category][name][$eqi]", searchParams.category)
    }

    const headers: HeadersInit = {}
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}/api/articles?${params.toString()}`, {
        cache: "no-store", // Ensure fresh data for listings
        headers,
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

export async function fetchArticleById(id: string, token?: string): Promise<ApiResponse<Article>> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const populateParams = "populate[comments][populate][user]=*&populate[user]=*&populate[category]=*"
    const headers: HeadersInit = {}
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    try {
        // Try direct fetch first (Strapi v5 documentId style)
        const res = await fetch(`${API_URL}/api/articles/${id}?${populateParams}`, {
            cache: "no-store",
            headers,
        })

        if (res.ok) {
            return res.json()
        }

        // If direct fetch fails (e.g. 404/403 or v4 numeric ID mismatch), try filtering
        // This handles cases where 'id' is a documentId but the endpoint expects numeric ID
        const filterRes = await fetch(`${API_URL}/api/articles?filters[documentId][$eq]=${id}&${populateParams}`, {
            cache: "no-store",
            headers,
        })

        if (filterRes.ok) {
            const data = await filterRes.json()
            if (data.data && data.data.length > 0) {
                // Return the first match, wrapping it in the expected single-item structure
                return { data: data.data[0], meta: data.meta }
            }
        }

        console.error(`Failed to fetch article ${id}: ${res.status} ${res.statusText}`)
        throw new Error(`Failed to fetch article: ${res.statusText}`)

    } catch (error) {
        console.error("Fetch article error:", error)
        throw error
    }
}
