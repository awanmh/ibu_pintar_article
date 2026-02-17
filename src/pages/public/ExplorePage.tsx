import { useState, useEffect } from "react";
import { useBlogStore } from "../../store/useBlogStore";
import { ArticleCard } from "../../components/public/ArticleCard";
import { Search, Filter } from "lucide-react";

const CATEGORIES = [
  "Semua",
  "Kehamilan",
  "Persalinan",
  "Tips Bayi",
  "Cerita Ibu",
  "Menyusui",
];

const ExplorePage = () => {
  const { articles, fetchArticles, loading } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      const data = await fetchArticles(page, 6, searchQuery, selectedCategory); // Limit 6 for grid
      if (data) {
        setTotalPages(data.totalPages);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [page, searchQuery, selectedCategory, fetchArticles]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-100 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-sage-900 mb-4 flex items-center gap-2">
              <Filter size={20} /> Filter
            </h2>

            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-sage-100 text-sage-800 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white shadow-sm font-medium"
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {selectedCategory === "Semua"
                ? "Semua Artikel"
                : `Kategori: ${selectedCategory}`}
            </h1>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {articles.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">
                    Tidak ada artikel yang ditemukan.
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              {articles.length > 0 && (
                <div className="flex justify-center gap-4 mt-12">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-6 py-2 rounded-full border border-sage-200 hover:bg-sage-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="flex items-center font-bold text-sage-900">
                    Halaman {page} dari {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-6 py-2 rounded-full border border-sage-200 hover:bg-sage-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;
