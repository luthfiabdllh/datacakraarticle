"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetMyArticlesQuery } from "@/redux/api/apiSlice"
import { Loader2, FileText, Layers, TrendingUp } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()
    const { data: articlesData, isLoading } = useGetMyArticlesQuery({
        userId: session?.user?.id as number
    }, {
        skip: !session?.user?.id
    })

    // Mock stats or derived if API supported it
    const totalArticles = articlesData?.meta?.pagination?.total || 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {session?.user?.username}! Here's an overview of your content.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="text-2xl font-bold">{totalArticles}</div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            +0 from last month (static)
                        </p>
                    </CardContent>
                </Card>
                {/* Add more stats cards as needed */}
            </div>
        </div>
    )
}
