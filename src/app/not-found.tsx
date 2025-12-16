import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404</h2>
            <h3 className="text-2xl font-semibold">Page Not Found</h3>
            <p className="text-muted-foreground max-w-md">
                Sorry, we couldn&apos;t clear find the page you&apos;re looking for. It might have been removed or moved to a new URL.
            </p>
            <Button asChild size="lg">
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}
