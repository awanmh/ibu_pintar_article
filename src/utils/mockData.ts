import type { Article, Comment } from "../types";
import { subDays } from "date-fns";

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "5 Tanda Persalinan Sudah Dekat yang Wajib Ibu Tahu",
    slug: "tanda-persalinan-dekat",
    excerpt:
      "Jangan panik, kenali tanda-tanda tubuh mulai mempersiapkan kelahiran si kecil.",
    content: "<p>Kontraksi palsu atau Braxton Hicks seringkali mengecoh...</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070&auto=format&fit=crop",
    category: "Persalinan",
    author: "Bidan Fifi",
    createdAt: subDays(new Date(), 2).toISOString(),
    readTime: 5,
    views: 120,
  },
  {
    id: "2",
    title: "Nutrisi Penting di Trimester Pertama Kehamilan",
    slug: "nutrisi-trimester-pertama",
    excerpt:
      "Asam folat bukan satu-satunya yang Anda butuhkan. Simak panduan lengkapnya.",
    content:
      "<p>Trimester pertama adalah masa krusial pembentukan organ janin...</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
    category: "Kehamilan",
    author: "Bidan Fifi",
    createdAt: subDays(new Date(), 5).toISOString(),
    readTime: 7,
    views: 85,
  },
  {
    id: "3",
    title: "Tips Memandikan Bayi Baru Lahir Tanpa Drama",
    slug: "tips-mandi-bayi",
    excerpt: "Langkah demi langkah memandikan bayi dengan aman dan nyaman.",
    content: "<p>Siapkan air hangat dengan suhu yang tepat...</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070&auto=format&fit=crop",
    category: "Tips Bayi",
    author: "Bidan Fifi",
    createdAt: subDays(new Date(), 10).toISOString(),
    readTime: 4,
    views: 200,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    articleId: "1",
    user: "Sarah Bunda",
    content: "Artikel yang sangat membantu, terima kasih Bu Bidan!",
    createdAt: subDays(new Date(), 1).toISOString(),
  },
];
