"use client"

import { motion } from "framer-motion"
import { PenTool, Users, Moon } from "lucide-react"
import Image from "next/image"

const features = [
    {
        title: "Write & Share",
        description: "Create your own articles and share your thoughts with the world. Our editor is designed for focus.",
        image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2670&auto=format&fit=crop",
        icon: PenTool,
    },
    {
        title: "Engage Community",
        description: "Join the conversation. Comment, discuss, and connect with like-minded readers and authors.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop",
        icon: Users,
    },
    {
        title: "Dark Mode & Accessibility",
        description: "Experience a reading environment that cares for your eyes. Seamlessly switch between themes.",
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=3411&auto=format&fit=crop", // Starry night
        icon: Moon,
    },
]

export function FeaturesSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                        Why Datacakra Feeds?
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl max-w-2xl mx-auto">
                        More than just a blog. A platform built for readers and writers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Stacked) */}
                    <div className="lg:col-span-2 grid gap-6">
                        {features.slice(0, 2).map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-3xl bg-background border shadow-sm h-[300px] flex items-center"
                            >
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 filter grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
                                </div>

                                <div className="relative z-10 p-8 md:p-12 max-w-md">
                                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column (Full Height) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative overflow-hidden rounded-3xl bg-background border shadow-sm h-full min-h-[400px] flex flex-col"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={features[2].image}
                                    alt={features[2].title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 filter grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            </div>

                            <div className="relative z-10 mt-auto p-8 md:p-12">
                                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary backdrop-blur-sm">
                                    {(() => {
                                        const Icon = features[2].icon
                                        return <Icon className="w-7 h-7" />
                                    })()}
                                </div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">{features[2].title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {features[2].description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
