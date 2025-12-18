import { apiSlice } from "../apiSlice"
import { Category, ApiResponse } from "@/types"

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<ApiResponse<Category[]>, { search?: string } | void>({
            query: (params) => {
                if (params && params.search) {
                    return `categories?filters[name][$containsi]=${params.search}`
                }
                return "categories"
            },
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
        updateCategory: builder.mutation<ApiResponse<Category>, { id: string; name: string }>({
            query: ({ id, name }) => ({
                url: `categories/${id}`,
                method: "PUT",
                body: { data: { name } },
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation<ApiResponse<Category>, string>({
            query: (id) => ({
                url: `categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
})

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi
