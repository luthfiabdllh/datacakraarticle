import { apiSlice } from "../apiSlice"

export const uploadApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
    useUploadImageMutation,
} = uploadApi
