import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getSession } from "next-auth/react"
import { Article, Category, ApiResponse } from "@/types"

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
    endpoints: (builder) => ({
        // --- Articles ---
        getArticles: builder.query<ApiResponse<Article[]>, { page?: number; pageSize?: number; search?: string, category?: string }>({
            query: (params) => {
                const query = new URLSearchParams()
                query.append("populate", "*")
                if (params.page) query.append("pagination[page]", params.page.toString())
                if (params.pageSize) query.append("pagination[pageSize]", params.pageSize.toString())
                if (params.search) query.append("filters[title][$containsi]", params.search)
                if (params.category) query.append("filters[category][name][$eqi]", params.category)
                return `articles?${query.toString()}`
            },
            providesTags: ["Article"],
        }),
        getMyArticles: builder.query<ApiResponse<Article[]>, { userId: number | string, page?: number, pageSize?: number }>({
            query: ({ userId, page = 1, pageSize = 10 }) => {
                const query = new URLSearchParams()
                query.append("populate", "*")
                query.append("filters[user][id][$eq]", userId.toString())
                query.append("pagination[page]", page.toString())
                query.append("pagination[pageSize]", pageSize.toString())
                return `articles?${query.toString()}`
            },
            providesTags: ["UserArticles"],
        }),
        getArticleById: builder.query<ApiResponse<Article>, string>({
            query: (id) => `articles/${id}?populate=*`,
            providesTags: (result, error, id) => [{ type: "Article", id }],
        }),
        createArticle: builder.mutation<ApiResponse<Article>, Partial<Article> & { category: number, user: number }>({
            query: (body) => ({
                url: "articles",
                method: "POST",
                body: { data: body },
            }),
            invalidatesTags: ["Article", "UserArticles"],
        }),
        updateArticle: builder.mutation<ApiResponse<Article>, { id: string; data: Partial<Article> }>({
            query: ({ id, data }) => ({
                url: `articles/${id}`,
                method: "PUT",
                body: { data },
            }),
            invalidatesTags: (result, error, { id }) => ["Article", "UserArticles", { type: "Article", id }],
        }),
        deleteArticle: builder.mutation<ApiResponse<Article>, string>({
            query: (id) => ({
                url: `articles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Article", "UserArticles"],
        }),

        // --- Categories ---
        getCategories: builder.query<ApiResponse<Category[]>, void>({
            query: () => "categories",
            providesTags: ["Category"],
        }),
        createCategory: builder.mutation<ApiResponse<Category>, { name: string }>({
            query: (body) => ({
                url: "categories",
                method: "POST",
                body: { data: body },
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation<ApiResponse<Category>, { id: number; name: string }>({
            query: ({ id, name }) => ({
                url: `categories/${id}`,
                method: "PUT",
                body: { data: { name } },
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation<ApiResponse<Category>, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        // --- Upload ---
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        uploadImage: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "upload",
                method: "POST",
                body: formData,
            }),
        }),
    }),
})

export const {
    useGetArticlesQuery,
    useGetMyArticlesQuery,
    useGetArticleByIdQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useUploadImageMutation,
} = apiSlice
