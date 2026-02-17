import { useBlogStore } from "../../store/useBlogStore";
import { Hero } from "../../components/public/Hero";
import { ArticleCard } from "../../components/public/ArticleCard";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  const { articles } = useBlogStore();

  // Logic: First article is Hero, others are list
  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Hero featured={featuredArticle} />

      {/* Trending Bar (Simple Ticker Concept) */}
      <section className="border-y border-sage-100 bg-white py-3 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sage-700 font-bold whitespace-nowrap">
            <TrendingUp size={18} />
            <span className="uppercase text-xs tracking-wider">
              Terpopuler:
            </span>
          </div>
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute whitespace-nowrap flex gap-8 text-sm text-gray-600 font-medium"
            >
              {[...articles, ...articles].map((a, i) => (
                <span key={i} className="cursor-pointer hover:text-sage-600">
                  {a.title}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-sage-900 mb-2">
              Berita Terbaru
            </h2>
            <p className="text-gray-500">
              Informasi terkini seputar kesehatan ibu dan anak
            </p>
          </div>
          <a
            href="/explore"
            className="text-sage-600 font-medium hover:text-sage-800 hidden md:block"
          >
            Lihat Semua &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          {latestArticles.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Belum ada artikel tambahan.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
