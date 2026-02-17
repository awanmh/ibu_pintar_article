import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article, Comment } from "../types";
import { apiClient } from "../api/client";
import { useAuthStore } from "./useAuthStore"; // Import auth store to access token

type BlogState = {
  articles: Article[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  selectedArticle: Article | null;

  // Actions
  fetchArticles: (
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
  ) => Promise<any>; // Return metadata
  fetchArticleBySlug: (slug: string) => Promise<void>;
  fetchComments: (articleSlug: string) => Promise<any>;

  addComment: (
    comment: Omit<Comment, "id" | "createdAt" | "isApproved">,
    articleId: string | number,
  ) => Promise<void>;

  createArticle: (
    article: Omit<Article, "id" | "views" | "createdAt" | "author">,
  ) => Promise<void>;
  deleteArticle: (id: string | number) => Promise<void>;

  // Admin Actions
  approveComment: (id: string | number) => Promise<void>;
  deleteComment: (id: string | number) => Promise<void>;
};

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      articles: [],
      comments: [],
      loading: false,
      error: null,
      selectedArticle: null,

      fetchArticles: async (
        page = 1,
        limit = 10,
        search = "",
        category = "",
      ) => {
        set({ loading: true, error: null });
        try {
          const params: any = { page, limit };
          if (search) params.search = search;
          if (category && category !== "Semua") params.category = category;

          const res = await apiClient.get<{
            articles: Article[];
            total: number;
            totalPages: number;
          }>("/articles", params); // Fix: pass params directly, not wrapped in { params }

          set(() => ({
            articles: res.data.articles,
            loading: false,
          }));
          return res.data;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      fetchArticleBySlug: async (slug) => {
        set({ loading: true, error: null });
        try {
          const res = await apiClient.get<Article>(`/articles/${slug}`);
          set({ selectedArticle: res.data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      fetchComments: async (articleSlug) => {
        try {
          const res = await apiClient.get<{
            comments: Comment[];
            isAdmin: boolean;
          }>(`/articles/${articleSlug}/comments`);
          set({
            comments: res.data.comments,
          });
          return res.data;
        } catch (err) {
          console.error(err);
        }
      },

      addComment: async (comment, articleId) => {
        try {
          const payload = { ...comment, articleId };
          const res = await apiClient.post<Comment>("/comments", payload);
          // Optimistic or Append
          set((state) => ({ comments: [res.data, ...state.comments] }));
        } catch (err: any) {
          console.error(err);
          throw err;
        }
      },

      createArticle: async (articleData) => {
        const { user } = useAuthStore.getState(); // Assuming auth store handles token injection via apiClient interceptor?
        // Wait, apiClient handles token automatically from localStorage.
        const authorName = user ? user.name : "Admin";

        const payload = { ...articleData, author: authorName };
        try {
          const res = await apiClient.post<Article>("/admin/articles", payload);
          set((state) => ({
            articles: [res.data, ...state.articles],
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      deleteArticle: async (id) => {
        try {
          await apiClient.delete(`/admin/articles/${id}`);
          set((state) => ({
            articles: state.articles.filter((a) => String(a.id) !== String(id)),
          }));
        } catch (err: any) {
          console.error(err);
          throw err;
        }
      },

      approveComment: async (id) => {
        try {
          await apiClient.patch(`/admin/comments/${id}/approve`, {});
          set((state) => ({
            comments: state.comments.map((c) =>
              String(c.id) === String(id) ? { ...c, isApproved: true } : c,
            ),
          }));
        } catch (err) {
          console.error(err);
        }
      },

      deleteComment: async (id) => {
        try {
          await apiClient.delete(`/admin/comments/${id}`);
          set((state) => ({
            comments: state.comments.filter((c) => String(c.id) !== String(id)),
          }));
        } catch (err) {
          console.error(err);
        }
      },
    }),
    {
      name: "blog-storage",
      partialize: (state) => ({ comments: state.comments }),
    },
  ),
);
