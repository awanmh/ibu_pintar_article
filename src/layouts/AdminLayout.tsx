import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("AdminLayout: user state:", user);
    if (!user) {
      console.log("AdminLayout: No user, redirecting to login");
      navigate("/login");
    }
  }, [user, navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Artikel", path: "/admin/articles", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-sage-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <h2 className="text-lg font-serif font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sage-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-sage-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold">Admin Panel</h2>
            <p className="text-sm text-sage-400">Ibu Pintar Blog</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-sage-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
          <div className="bg-sage-800/50 rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-sage-300 truncate">{user.email}</p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sage-300 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            <span>Ke Website</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full mt-1 flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};
