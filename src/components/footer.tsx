import Link from "next/link"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand & Description */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Datacakra Feeds
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering writers and readers to connect through meaningful stories. Join our growing community of travelers and thinkers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <nav className="flex flex-col gap-3">
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <Link href="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                                Articles
                            </Link>
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                About Us
                            </Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground">Legal</h3>
                        <nav className="flex flex-col gap-3">
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                                Cookie Policy
                            </Link>
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-foreground">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm">
                            Subscribe to our newsletter for the latest travel stories and updates.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Datacakra Feeds. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href="https://instagram.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
