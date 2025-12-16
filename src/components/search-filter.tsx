"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Category } from "@/types"

interface SearchFilterProps {
    categories: Category[]
}

export function SearchFilter({ categories }: SearchFilterProps) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }
        replace(`/articles?${params.toString()}`)
    }, 300)

    const handleCategory = (category: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        if (category && category !== "all") {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        replace(`/articles?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
                placeholder="Search articles..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
                className="sm:max-w-xs"
            />
            <Select
                onValueChange={handleCategory}
                defaultValue={searchParams.get("category")?.toString() || "all"}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
