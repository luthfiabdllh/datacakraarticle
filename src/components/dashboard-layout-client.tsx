"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconUserBolt,
    IconPencil,
    IconCategory,
    IconArticle,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

export function DashboardLayoutClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User;
}) {
    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-foreground" />
            ),
        },
        {
            label: "My Articles",
            href: "/dashboard/my-articles",
            icon: (
                <IconArticle className="h-5 w-5 shrink-0 text-foreground" />
            ),
        },
        {
            label: "Create Article",
            href: "/dashboard/create",
            icon: (
                <IconPencil className="h-5 w-5 shrink-0 text-foreground" />
            ),
        },
        {
            label: "Categories",
            href: "/dashboard/categories",
            icon: (
                <IconCategory className="h-5 w-5 shrink-0 text-foreground" />
            ),
        },
        {
            label: "Profile",
            href: "/dashboard/profile",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-foreground" />
            ),
        },
    ];

    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-border bg-muted/50 md:flex-row",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            <div onClick={handleLogout} className="cursor-pointer">
                                <SidebarLink
                                    link={{
                                        label: "Logout",
                                        href: "#",
                                        icon: (
                                            <IconArrowLeft className="h-5 w-5 shrink-0 text-foreground" />
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: user.username || "User",
                                email: user.email || "",
                                href: "/dashboard/profile",
                                icon: (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.username || "User"}&background=random`}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 overflow-y-auto bg-background border border-border rounded-tl-2xl p-2 md:p-10">
                {children}
            </main>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-primary"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-primary"
            >
                Datacakra
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-primary"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
        </Link>
    );
};
