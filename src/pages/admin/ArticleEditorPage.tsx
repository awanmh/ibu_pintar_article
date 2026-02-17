import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useBlogStore } from "../../store/useBlogStore";
import { Save, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Article } from "../../types";
import { ImageUpload } from "../../components/admin/ImageUpload";

const CATEGORIES = [
  "Kehamilan",
  "Persalinan",
  "Tips Bayi",
  "Cerita Ibu",
  "Umum",
];

const ArticleEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createArticle, articles } = useBlogStore();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: "",
    slug: "",
    thumbnail: "",
    category: "Umum",
    excerpt: "",
    content: "",
    readTime: 5,
    author: "Bidan Fifi", // Default
  });

  useEffect(() => {
    if (isEditing && id) {
      const article = articles.find((a) => a.id === id);
      if (article) {
        setFormData(article);
      } else {
        navigate("/admin/articles");
      }
    }
  }, [isEditing, id, articles, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      if (isEditing) {
        alert("Edit feature is not yet implemented in backend.");
        // updateArticle(refinedArticle);
      } else {
        await createArticle({
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          content: formData.content,
          thumbnail: formData.thumbnail || "",
          category: (formData.category as any) || "Umum",
          excerpt: formData.excerpt || "",
          readTime: Number(formData.readTime) || 5,
        });
      }
      navigate("/admin/articles");
    } catch (error) {
      console.error("Failed to save article", error);
      alert("Gagal menyimpan artikel");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Helmet>
        <title>
          {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"} | Ibu Pintar Admin
        </title>
      </Helmet>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/articles")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">
            {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage-100 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Judul Artikel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 text-lg font-medium"
              placeholder="Contoh: 5 Tips Menyusui..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Estimasi Baca (Menit)
              </label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <ImageUpload
              currentImage={formData.thumbnail}
              onUpload={(url) => setFormData({ ...formData, thumbnail: url })}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Kutipan Singkat (Excerpt)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 h-24"
              placeholder="Ringkasan singkat untuk kartu artikel..."
            ></textarea>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage-100">
          <label className="block text-sm font-bold text-gray-700 mb-4">
            Konten Artikel
          </label>
          <div className="h-[500px] mb-12">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="h-full"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-sage-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-sage-700 transition-colors shadow-lg shadow-sage-200 hover:-translate-y-1 transform"
          >
            <Save size={20} />
            {isEditing ? "Simpan Perubahan" : "Terbitkan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditorPage;
