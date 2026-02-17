import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiClient } from "../../api/client";
import { User, Mail, Lock, Save, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Password baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { name };
      if (password) payload.password = password;

      await apiClient.put<any>("/profile/", payload);
      setSuccess("Profil berhasil diperbarui.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profil Saya | Ibu Pintar</title>
      </Helmet>
      <div className="min-h-screen bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Pengaturan Akun
            </h1>
            <p className="mt-2 text-gray-600">
              Kelola informasi pribadi dan keamanan akun Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-6 text-center h-full">
                <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-serif font-bold text-sage-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-sm text-sage-600 font-medium bg-sage-50 inline-block px-3 py-1 rounded-full mt-2 capitalize">
                  {user?.role}
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  Bergabung sejak {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-sage-600" />
                  Edit Informasi
                </h2>

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <Save size={16} />
                    {success}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all font-medium"
                        placeholder="Nama Lengkap Anda"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input (Read Only) */}
                  <div className="space-y-2 opacity-75">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Email (Tidak dapat diubah)
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Password Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Lock size={18} className="text-sage-600" />
                      Ubah Password
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password Baru (Opsional)"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                        />
                      </div>

                      {password && (
                        <div className="relative animate-in fade-in slide-in-from-top-2">
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi Password Baru"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sage-900 text-white font-bold py-4 rounded-xl hover:bg-sage-800 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-sage-200"
                    >
                      {loading ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          Simpan Perubahan <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
