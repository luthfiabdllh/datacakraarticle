"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, Variants, AnimatePresence } from "framer-motion"
import { User } from "lucide-react"
import Image from "next/image"

import { Article } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface TravelHeroProps {
    articles: Article[]
}

export function Hero({ articles = [] }: TravelHeroProps) {
    const [, setIsScrolled] = useState(false)
    const targetRef = useRef<HTMLDivElement>(null)

    // Scroll detection for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Parallax Effect setup
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    })

    // Smooth parallax movement (Anti-Gravity 1)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.5 }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    }

    const [index, setIndex] = useState(0)

    // Auto-rotate
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % articles.length)
        }, 25000)
        return () => clearInterval(timer)
    }, [articles.length])

    const currentArticle = articles[index]
    const nextArticles = [
        articles[(index + 1) % articles.length],
        articles[(index + 2) % articles.length],
        articles[(index + 3) % articles.length]
    ].filter(Boolean)

    if (!currentArticle) return null

    return (
        <div ref={targetRef} className="relative h-[100vh] bg-stone-900">
            {/* --- Hero Section --- */}
            <div className="relative h-screen w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentArticle?.documentId || "bg"}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 z-0"
                    >
                        {/* Parallax Background Image */}
                        <motion.div style={{ y, scale }} className="absolute inset-0">
                            <Image
                                src={currentArticle?.cover_image_url || "/hero-bg.png"}
                                alt={currentArticle?.title || "Hero Background"}
                                fill
                                className="object-cover"
                                priority
                                quality={100}
                            />
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 container mx-auto px-6 pb-24 flex flex-col justify-end">
                    <motion.div
                        key={`${currentArticle?.documentId || "content"}-${index}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="max-w-4xl"
                    >
                        {/* Badge */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium tracking-wide">
                                {currentArticle?.category?.name || "Unknown"}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-2xl"
                        >
                            {currentArticle?.title ? (
                                <>
                                    {currentArticle.title.split(' ').slice(0, 2).join(' ')} <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                                        {currentArticle.title.split(' ').slice(2).join(' ')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                                        Unknown Title
                                    </span>
                                </>
                            )}
                        </motion.h1>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 items-start md:items-end">
                        <div className="flex flex-col gap-6 max-w-xl">
                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="text-lg text-white/80 leading-relaxed"
                            >
                                {currentArticle?.description?.slice(0, 150) + (currentArticle?.description?.length > 150 ? "..." : "") || "Unknown Description"}
                            </motion.p>

                            {/* Read Article Button */}
                            <motion.div variants={itemVariants}>
                                <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-semibold px-8">
                                    <Link href={`/articles/${currentArticle?.documentId}`}>
                                        Read Article
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>

                        {/* Meta User */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-start md:items-end min-w-max"
                        >
                            <div className="flex items-center gap-4 rounded-2xl cursor-pointer">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                    <div className="bg-stone-500 w-full h-full flex items-center justify-center text-white font-bold">
                                        <User className="h-6 w-6" />
                                    </div>
                                </div>
                                <h4 className="text-white text-lg font-semibold">{currentArticle?.user?.username || "Unknown Author"}</h4>
                            </div>
                            <p className="flex items-center gap-2 mt-2 text-sm text-white/80">
                                {currentArticle?.publishedAt ? new Date(currentArticle.publishedAt).toLocaleDateString() : "Date"}
                                <span className="w-1 h-1 rounded-full bg-white/40" />
                                {currentArticle?.comments?.length || 0} Comments
                            </p>
                        </motion.div>
                    </div>

                    {/* Pagination Dots */}
                    <motion.div variants={itemVariants} className="mt-8 flex gap-3">
                        {articles.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div >
        </div >
    )
}
