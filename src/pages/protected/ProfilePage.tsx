import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiClient } from "../../api/client";

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

      // Update local user state (hacky, but works if we re-login or update store)
      // Ideally useAuthStore should have an update method.
      // For now, let's just show success.
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-sage-100">
        <h1 className="text-2xl font-serif font-bold text-sage-900 mb-6">
          Edit Profil
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sage-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email tidak dapat diubah.
            </p>
          </div>

          <hr className="my-4 border-gray-200" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password Baru (Opsional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sage-400 focus:outline-none"
            />
          </div>

          {password && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sage-400 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-600 text-white font-bold py-3 rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
