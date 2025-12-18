import { ApiResponse, Category } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
