"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGetCategoriesQuery, useUploadImageMutation } from "@/redux/api"
import { useEffect, useState } from "react"
import { Loader2, UploadCloud, X } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }),
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
    }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    cover_image_url: z.string().url({
        message: "Please upload a valid cover image.",
    }),
})

interface ArticleFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
    isSubmitting?: boolean
}

export function ArticleForm({ initialData, onSubmit, isSubmitting }: ArticleFormProps) {
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery()
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
    const [preview, setPreview] = useState<string | null>(initialData?.cover_image_url || null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            category: initialData?.category?.id?.toString() || "",
            cover_image_url: initialData?.cover_image_url || "",
        },
    })

    // Reset category if initialData loads late
    useEffect(() => {
        if (initialData?.category?.id) {
            form.setValue("category", initialData.category.id.toString())
        }
    }, [initialData, form])

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("files", file)

        try {
            const res = await uploadImage(formData).unwrap()
            if (res && res[0]) {
                const url = res[0].url
                // Prepend backend URL if relative path (Strapi local provider)
                // Check if full URL or relative
                const fullUrl = url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`

                form.setValue("cover_image_url", fullUrl)
                setPreview(fullUrl)
                toast.success("Image uploaded successfully")
            }
        } catch {
            toast.error("Failed to upload image")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter article title" {...field} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger disabled={isLoadingCategories} className="bg-background">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categoriesData?.data?.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your article content here..."
                                        className="min-h-[300px] resize-y bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cover_image_url"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <Input
                                            type="hidden"
                                            {...field}
                                        />
                                        {preview ? (
                                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted/30">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="object-cover w-full h-full"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 shadow-sm"
                                                    onClick={() => {
                                                        setPreview(null)
                                                        form.setValue("cover_image_url", "")
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full">
                                                <label
                                                    htmlFor="dropzone-file"
                                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-muted-foreground/25 hover:border-muted-foreground/50"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        {isUploading ? (
                                                            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                                                        ) : (
                                                            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                                                        )}
                                                        <p className="mb-2 text-sm text-muted-foreground">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="dropzone-file"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || isUploading} size="lg" className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Article" : "Publish Article"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
