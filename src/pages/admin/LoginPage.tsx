import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal login");
      }

      // Store in Zustand (and localStorage)
      login(data.user, data.token);

      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login Admin | Ibu Pintar</title>
      </Helmet>
      <div className="min-h-screen bg-sage-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-sage-100 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-sage-100 rounded-full text-sage-600 mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Masuk
            </h1>
            <p className="text-gray-500">Masuk untuk mengelola blog</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="email@ibupintar.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="******"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sage-600 text-white py-3 rounded-lg font-bold hover:bg-sage-700 transition-colors"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-sage-600 font-bold hover:underline"
            >
              Daftar disini
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
