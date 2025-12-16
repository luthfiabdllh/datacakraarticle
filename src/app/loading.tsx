import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container py-10 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-[300px]" />
                <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
