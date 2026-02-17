import { useBlogStore } from "../../store/useBlogStore";
import { FileText, Eye, MessageCircle, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const DashboardPage = () => {
  const { articles, comments } = useBlogStore();

  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalComments = comments.length;

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard | Ibu Pintar Admin</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-sage-900">
          Dashboard
        </h1>
        <p className="text-gray-500">Selamat datang kembali, Bidan Fifi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Artikel"
          value={articles.length}
          color="bg-blue-500"
        />
        <StatCard
          icon={Eye}
          title="Total Pembaca"
          value={totalViews}
          color="bg-green-500"
        />
        <StatCard
          icon={MessageCircle}
          title="Komentar Masuk"
          value={totalComments}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          title="Rata-rata Baca"
          value={
            articles.length > 0 ? Math.round(totalViews / articles.length) : 0
          }
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-8">
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Artikel Terbaru
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Judul</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {articles.slice(0, 5).map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {article.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-sage-100 text-sage-800 font-bold">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium text-sm">
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
