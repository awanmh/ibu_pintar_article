import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlogStore } from "../../store/useBlogStore";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ArticlesPage = () => {
  const { articles, deleteArticle, fetchArticles } = useBlogStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = (id: string | number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      deleteArticle(id);
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Kelola Artikel | Ibu Pintar Admin</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">
            Artikel
          </h1>
          <p className="text-gray-500">Kelola semua artikel Anda disini</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="bg-sage-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-sage-700 transition-colors shadow-lg shadow-sage-200"
        >
          <Plus size={20} /> Tulis Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Thumbnail</th>
              <th className="px-6 py-4 font-medium">Judul & Kutipan</th>
              <th className="px-6 py-4 font-medium">Kategori</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 w-24">
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-16 h-12 object-cover rounded-lg bg-gray-200"
                  />
                </td>
                <td className="px-6 py-4 max-w-md">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {article.excerpt}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-sage-100 text-sage-800 font-bold border border-sage-200">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Belum ada artikel. Mulai menulis sekarang!
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
