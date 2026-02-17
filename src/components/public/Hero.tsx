import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Article } from "../../types";

interface HeroProps {
  featured: Article;
}

export const Hero: React.FC<HeroProps> = ({ featured }) => {
  if (!featured) return null;

  return (
    <section className="relative px-4 pb-12 pt-6 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-sage-50 rounded-3xl overflow-hidden shadow-sm border border-sage-100 p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="order-2 md:order-1 space-y-6"
        >
          <div className="inline-block bg-sage-200 text-sage-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            Unggulan Minggu Ini
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-sage-900 leading-tight">
            {featured.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            {featured.excerpt}
          </p>

          <div className="pt-4">
            <Link
              to={`/article/${featured.slug}`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-sage-800 px-8 text-base font-medium text-white shadow-lg shadow-sage-200 transition-all hover:bg-sage-700 hover:shadow-xl hover:-translate-y-1"
            >
              Baca Artikel
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 md:order-2 relative group"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transform rotate-2 transition-transform duration-500 group-hover:rotate-0">
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};
