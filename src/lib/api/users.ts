import { ApiResponse, User } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchUserProfile(token: string): Promise<User> {
    if (!API_URL) throw new Error("API_URL is not defined")

    const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch user profile")
    }

    return res.json()
}
