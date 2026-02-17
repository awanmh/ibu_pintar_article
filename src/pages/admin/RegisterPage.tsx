import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !email.endsWith("@ibupintar.com") &&
      !email.endsWith("@ibupintar.admin.com")
    ) {
      setError(
        "Email harus menggunakan domain @ibupintar.com (User) atau @ibupintar.admin.com (Admin)",
      );
      return;
    }

    // Password Validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password wajib minimal 8 karakter, mengandung huruf besar, angka, dan simbol (!@#$...).",
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar");
      }

      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Daftar | Ibu Pintar</title>
      </Helmet>
      <div className="min-h-screen bg-sage-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-sage-100 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-sage-100 rounded-full text-sage-600 mb-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Daftar Akun
            </h1>
            <p className="text-gray-500">Bergabung sebagai penulis</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (@ibupintar.com)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
                placeholder="contoh@ibupintar.com"
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
                placeholder="Min 8 kar, 1 Besar, 1 Angka, 1 Simbol"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Contoh: @IbuPintar123
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-sage-600 text-white py-3 rounded-lg font-bold hover:bg-sage-700 transition-colors"
            >
              Daftar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-sage-600 font-bold hover:underline"
            >
              Masuk disini
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
