"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md">
                We encountered an error while processing your request. Please try again later.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.href = "/"}>Go Home</Button>
                <Button variant="outline" onClick={() => reset()}>
                    Try again
                </Button>
            </div>
        </div>
    )
}
