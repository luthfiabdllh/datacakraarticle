"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Upload, LogOut, Layers } from "lucide-react"
import { signOut } from "next-auth/react"

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Articles",
        href: "/dashboard/my-articles",
        icon: FileText,
    },
    {
        title: "Create Article",
        href: "/dashboard/create",
        icon: Upload,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Layers,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col border-r bg-background w-64">
            <div className="p-6">
                <h2 className="text-lg font-bold tracking-tight">Author Stats</h2>
            </div>
            <div className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn("w-full justify-start gap-2", pathname === item.href && "bg-secondary")}
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    </Button>
                ))}
            </div>
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    )
}
