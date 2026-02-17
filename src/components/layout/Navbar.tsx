import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import iconLogo from "../../assets/icon.png";
import { useAuthStore } from "../../store/useAuthStore";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Artikel", path: "/explore" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full overflow-hidden transition-transform group-hover:scale-105">
            <img
              src={iconLogo}
              alt="Ibu Pintar Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xl font-serif font-bold leading-none ${
                scrolled ? "text-sage-900" : "text-sage-800"
              }`}
            >
              Ibu Pintar
            </span>
            <span
              className={`text-sm font-cursive ${
                scrolled ? "text-sage-700" : "text-sage-600"
              }`}
            >
              by Aisyalfi
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-sage-600"
                  : "text-gray-600 hover:text-sage-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full bg-sage-100 text-sage-800 font-bold hover:bg-sage-200 transition-colors text-sm"
                >
                  Dashboard Admin
                </Link>
              )}

              <div className="relative group">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-sage-200 hover:border-sage-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </Link>

                {/* Dropdown for future expansion if needed, currently just link acts as profile btn */}
              </div>

              <button
                onClick={logout}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full bg-sage-900 text-white font-bold hover:bg-sage-800 transition-all shadow-lg shadow-sage-200 hover:shadow-sage-300 transform hover:-translate-y-0.5"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md absolute w-full px-4 py-6 shadow-lg">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-800"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-100" />

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-sage-600"
                  >
                    Dashboard Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-800"
                >
                  Profil Saya
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-lg font-medium text-red-500 text-left"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-sage-600"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
