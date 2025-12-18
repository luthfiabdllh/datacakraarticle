import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { fetchArticles } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  const { data: articles } = await fetchArticles({ page: 1, pageSize: 3 }, session?.user?.jwt)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Expand Your Knowledge with Datacakra Feeds
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover insightful articles, trends, and tutorials from our community of expert authors.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/articles">Start Reading</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/register">Become an Author</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Articles
            </h2>
            <Button variant="ghost" asChild className="group">
              <Link href="/articles" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Write & Share</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create your own articles and share your thoughts with the world. Easy to use editor.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Engage Community</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Comment on articles, discuss ideas, and connect with other readers and authors.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Dark Mode Support</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Read comfortably at any time of day with our fully supported dark mode theme.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 Datacakra Feeds. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
