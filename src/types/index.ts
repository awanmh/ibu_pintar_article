export interface Comment {
  id: string | number;
  articleId: string | number;
  user: string;
  userRole?: string; // "admin" | "user"
  content: string;
  isApproved?: boolean; // New field
  createdAt: string;
}

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from Rich Text
  thumbnail: string;
  category:
    | "Kehamilan"
    | "Persalinan"
    | "Tips Bayi"
    | "Cerita Ibu"
    | "Umum"
    | "Menyusui";
  author: string;
  createdAt: string;
  readTime: number; // minutes
  views: number;
}

export interface User {
  id: string;
  username: string;
  role: "admin" | "user";
}
