import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogStore } from "../../store/useBlogStore";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion, useScroll, useSpring } from "framer-motion";
import { Clock, Share2, MessageCircle, ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
// Unused import removed

const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  // Removed getArticle. Added fetchArticleBySlug.
  const {
    fetchArticleBySlug,
    comments,
    addComment,
    approveComment,
    deleteComment,
    fetchComments,
    selectedArticle,
  } = useBlogStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (slug) {
        setLoading(true);
        await fetchArticleBySlug(slug);
        await fetchComments(slug);
        setLoading(false);
      }
    };
    loadArticle();
  }, [slug, fetchArticleBySlug, fetchComments]);

  // Use comments directly as they are now scoped to the article by fetchComments
  const articleComments = comments;
  const article = selectedArticle;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-gray-800">Artikel tidak ditemukan</h1>
        <Link
          to="/explore"
          className="text-sage-600 hover:text-sage-800 mt-4 inline-block"
        >
          &larr; Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim() || !article) return;

    const newComment: any = {
      // id: crypto.randomUUID(), // Backend generates ID
      // articleId: article.id, // Handled by action
      user: userName,
      content: commentText,
      // createdAt // Backend
    };

    await addComment(newComment, article.id);
    setCommentText("");
    setUserName("");
    alert("Komentar berhasil dikirim dan menunggu moderasi Admin.");
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | Ibu Pintar</title>
      </Helmet>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sage-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="bg-white min-h-screen pb-20">
        {/* Header / Cover */}
        <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
            <div className="container mx-auto max-w-4xl">
              <Link
                to="/explore"
                className="inline-flex items-center text-sage-200 hover:text-white mb-6 transition-colors font-medium"
              >
                <ChevronLeft size={20} className="mr-1" /> Kembali
              </Link>

              <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-wider mb-4 opacity-90">
                <span className="bg-sage-600 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {article.readTime} Menit Baca
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sage-100">
                <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white text-lg">
                    {article.author}
                  </p>
                  <p className="text-sm opacity-80">
                    {format(new Date(article.createdAt), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Social Media (Sticky) */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-32 space-y-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Ikuti Kami
                </p>
                <div className="flex flex-col gap-4 items-center">
                  <a
                    href="https://instagram.com/ibupintar_byaisyalfi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full text-pink-600 shadow-md flex items-center justify-center hover:bg-pink-50 transition-all hover:scale-110"
                    title="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com/@ibupintar_byaisyalfi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full text-black shadow-md flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
                    title="TikTok"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-music"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </aside>

            {/* Center Content - Main Article */}
            <main className="lg:col-span-7">
              <article className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-sage-200/50">
                {/* Share Buttons - Inline Top (Mobile/Tablet visible, Desktop also visible for convenience) */}
                <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-sage-600 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 flex items-center justify-center">
                        <Share2 size={20} />
                      </div>
                      <span className="text-sm font-medium hidden sm:block">
                        Bagikan
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-sage-600 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 hover:bg-sage-50 flex items-center justify-center">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-sm font-medium hidden sm:block">
                        {articleComments.length} Komentar
                      </span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 font-medium italic">
                    {article.views} melihat
                  </div>
                </div>

                {/* Main Content Body */}
                <div
                  className="prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-headings:text-sage-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-sage-600 hover:prose-a:text-sage-800 prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-sage-300 prose-blockquote:bg-sage-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic max-w-none font-sans w-full break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <hr className="my-12 border-sage-100" />

                {/* Comments Section */}
                <section id="comments">
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-8 flex items-center gap-2">
                    <MessageCircle /> {articleComments.length} Komentar
                  </h3>

                  <form
                    onSubmit={handleCommentSubmit}
                    className="bg-sage-50 p-6 rounded-2xl mb-8 border border-sage-100"
                  >
                    <h4 className="font-bold text-lg mb-4 text-sage-800">
                      Tinggalkan Komentar
                    </h4>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Nama Anda"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <textarea
                        placeholder="Tulis pendapat Anda..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 h-32"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-sage-600 text-white px-8 py-3 rounded-full font-bold hover:bg-sage-700 transition-colors shadow-lg shadow-sage-200"
                    >
                      Kirim Komentar
                    </button>
                  </form>

                  <div className="space-y-6">
                    {articleComments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`border-b border-gray-100 pb-6 last:border-0 ${!comment.isApproved ? "opacity-50 bg-gray-50 p-4 rounded-lg" : ""}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-sage-900 flex items-center gap-2">
                            {comment.user}
                            {comment.userRole === "admin" && (
                              <span className="bg-sage-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                            {!comment.isApproved && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Waiting Moderation
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(
                              new Date(comment.createdAt),
                              "dd MMM yyyy HH:mm",
                              { locale: id },
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>

                        {/* Admin Actions */}
                        {isAdmin && (
                          <div className="mt-2 flex gap-2">
                            {!comment.isApproved && (
                              <button
                                onClick={() => approveComment(comment.id)}
                                className="text-xs text-green-600 font-bold hover:underline"
                              >
                                [Approve]
                              </button>
                            )}
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="text-xs text-red-600 font-bold hover:underline"
                            >
                              [Delete]
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </article>
            </main>

            {/* Right Sidebar - Related Articles */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-sage-100 sticky top-32">
                <h3 className="font-serif font-bold text-xl text-sage-900 mb-4 pb-2 border-b border-sage-100">
                  Baca Juga
                </h3>
                <div className="flex flex-col gap-6">
                  {/* We will map related articles here once we fetch them */}
                  <RelatedArticles
                    currentArticleId={article.id}
                    category={article.category}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

const RelatedArticles = ({
  currentArticleId,
  category,
}: {
  currentArticleId: string | number;
  category: string;
}) => {
  const { articles } = useBlogStore();

  const related = articles
    .filter((a) => a.category === category && a.id !== currentArticleId)
    .slice(0, 3);

  if (related.length === 0)
    return <p className="text-gray-500 text-sm">Belum ada artikel terkait.</p>;

  return (
    <>
      {related.map((article) => (
        <Link
          key={article.id}
          to={`/article/${article.slug}`}
          className="group block"
        >
          <div className="aspect-video rounded-lg overflow-hidden mb-2">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <h4 className="font-bold text-sage-900 leading-tight group-hover:text-sage-600 transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {article.readTime} menit baca
          </p>
        </Link>
      ))}
    </>
  );
};

export default ArticleDetailPage;
