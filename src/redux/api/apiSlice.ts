import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getSession } from "next-auth/react"

// Custom base query to handle authentication
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
    prepareHeaders: async (headers) => {
        const session = await getSession()
        if (session?.user?.jwt) {
            headers.set("Authorization", `Bearer ${session.user.jwt}`)
        }
        return headers
    },
})

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Article", "Category", "UserArticles"],
    endpoints: () => ({}),
})
