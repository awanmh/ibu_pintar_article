// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export const apiClient = {
  get: async <T>(endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        url.searchParams.append(key, String(params[key]));
      }
    });

    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleResponse<T>(res);
  },

  post: async <T>(endpoint: string, body: any) => {
    return request<T>(endpoint, "POST", body);
  },

  put: async <T>(endpoint: string, body: any) => {
    return request<T>(endpoint, "PUT", body);
  },

  patch: async <T>(endpoint: string, body: any) => {
    return request<T>(endpoint, "PATCH", body);
  },

  delete: async <T>(endpoint: string) => {
    return request<T>(endpoint, "DELETE");
  },

  // Expose URL for direct usage if needed
  baseURL: API_URL,
};

async function request<T>(endpoint: string, method: string, body?: any) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  return handleResponse<T>(res);
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (!res.ok) {
    // Try to parse error message from JSON
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || errorData.error || "API Error");
    } catch (e: any) {
      throw new Error(e.message || res.statusText);
    }
  }
  return res.json();
}
