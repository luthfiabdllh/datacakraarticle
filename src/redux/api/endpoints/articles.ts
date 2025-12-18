import { apiSlice } from "../apiSlice"
import { Article, ApiResponse } from "@/types"

export const articlesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
        getMyArticles: builder.query<ApiResponse<Article[]>, { userId: number | string, page?: number, pageSize?: number, search?: string, category?: string }>({
            query: ({ userId, page = 1, pageSize = 10, search, category }) => {
                const query = new URLSearchParams()
                query.append("populate", "*")
                query.append("filters[user][id][$eq]", userId.toString())
                query.append("pagination[page]", page.toString())
                query.append("pagination[pageSize]", pageSize.toString())

                if (search) query.append("filters[title][$containsi]", search)
                if (category && category !== "all") query.append("filters[category][id][$eq]", category)

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
    }),
})

export const {
    useGetArticlesQuery,
    useGetMyArticlesQuery,
    useGetArticleByIdQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articlesApi
