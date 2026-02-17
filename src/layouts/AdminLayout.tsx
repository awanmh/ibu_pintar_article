import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LayoutDashboard, FileText, LogOut, ArrowLeft } from "lucide-react";

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("AdminLayout: user state:", user);
    if (!user) {
      console.log("AdminLayout: No user, redirecting to login");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Artikel", path: "/admin/articles", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sage-900 text-white fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-sage-800">
          <h2 className="text-xl font-serif font-bold">Admin Panel</h2>
          <p className="text-sm text-sage-400">Ibu Pintar Blog</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? "bg-sage-700 text-white"
                  : "text-sage-300 hover:bg-sage-800 hover:text-white"
              }`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sage-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sage-300 hover:text-white mb-2"
          >
            <ArrowLeft size={20} />
            <span>Ke Website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
