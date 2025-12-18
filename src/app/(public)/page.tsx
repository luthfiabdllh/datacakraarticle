import { fetchArticles } from "@/lib/api"
import { auth } from "@/auth"
import { Hero } from "@/components/hero"
import { FeaturesSection } from "@/components/features-section"
import { FeaturedArticles } from "@/components/featured-articles"

export default async function Home() {
  const session = await auth()
  const { data: heroArticles } = await fetchArticles({ page: 1, pageSize: 3 }, session?.user?.jwt)
  const { data: featuredArticles } = await fetchArticles({ page: 1, pageSize: 9 }, session?.user?.jwt)

  return (
    <>
      <Hero articles={heroArticles} />
      <FeaturedArticles articles={featuredArticles} />
      <FeaturesSection />
    </>
  )
}
