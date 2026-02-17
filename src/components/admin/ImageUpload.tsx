import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export const ImageUpload = ({ onUpload, currentImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Hanya file JPG, PNG, atau WEBP yang diperbolehkan.");
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengupload gambar.");
      }

      const data = await response.json();
      const imageUrl = `http://localhost:8080${data.url}`;

      setPreview(imageUrl);
      onUpload(imageUrl);
    } catch (err) {
      setError("Terjadi kesalahan saat upload.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Thumbnail Artikel
      </label>

      {preview ? (
        <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden group">
          <img
            src={preview}
            alt="Thumbnail Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hapus Gambar"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-sage-300 border-dashed rounded-xl cursor-pointer bg-sage-50 hover:bg-sage-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-sage-600">
            {loading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sage-600"></div>
            ) : (
              <>
                <Upload size={32} className="mb-2" />
                <p className="mb-2 text-sm font-semibold">Klik untuk upload</p>
                <p className="text-xs opacity-75">JPG, PNG, WEBP (Max 2MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
