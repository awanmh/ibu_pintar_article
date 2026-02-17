import { Heart, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-sage-900 text-sage-100 py-12 mt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl font-bold text-white leading-none">
            Ibu Pintar
          </span>
          <span className="font-cursive text-lg text-sage-300">
            by Aisyalfi
          </span>
        </div>
        <p className="max-w-md mx-auto text-sage-200 mb-8">
          Menemani perjalanan ibu dan buah hati dengan informasi terpercaya dan
          penuh kasih sayang.
        </p>

        {/* Social Media & Location */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="flex gap-4">
            <a
              href="https://instagram.com/ibupintar_byaisyalfi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full text-pink-600 shadow-md flex items-center justify-center hover:bg-pink-50 transition-all hover:scale-110"
              title="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@ibupintar_byaisyalfi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full text-black shadow-md flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
              title="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-music"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-2 text-sage-300">
            <MapPin size={18} />
            <span>Bangkalan, Madura</span>
          </div>
        </div>
        <div className="pt-8 border-t border-sage-800 flex flex-col md:flex-row justify-between items-center text-sm text-sage-400">
          <p>
            &copy; {new Date().getFullYear()} Ibu Pintar Blog. All rights
            reserved.
          </p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            Made with{" "}
            <Heart size={14} className="text-pink-400 fill-pink-400" /> by Bidan
            Fifi
          </div>
        </div>
      </div>
    </footer>
  );
};
