import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "../../types";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-sage-100 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-sage-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-sage-500 mb-3">
          <span>
            {format(new Date(article.createdAt), "d MMMM yyyy", { locale: id })}
          </span>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{article.readTime} min baca</span>
          </div>
        </div>

        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 leading-tight group-hover:text-sage-700 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
          {article.excerpt}
        </p>

        <div className="flex items-center text-sage-600 font-medium text-sm group-hover:gap-2 transition-all">
          Baca Selengkapnya <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};
