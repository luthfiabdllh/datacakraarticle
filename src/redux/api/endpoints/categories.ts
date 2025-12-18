import { apiSlice } from "../apiSlice"
import { Category, ApiResponse } from "@/types"

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
})

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi
