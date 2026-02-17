import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";

import HomePage from "./pages/public/HomePage";

// Placeholder Pages - We will create real ones next
import ExplorePage from "./pages/public/ExplorePage";
import ArticleDetailPage from "./pages/public/ArticleDetailPage";

import LoginPage from "./pages/admin/LoginPage";
import RegisterPage from "./pages/admin/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ArticlesPage from "./pages/admin/ArticlesPage";
// Duplicate removed
import ArticleEditorPage from "./pages/admin/ArticleEditorPage";
import ProfilePage from "./pages/protected/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Will fix path after search

function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="article/:slug" element={<ArticleDetailPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Keep /admin/login for backward compat or remove? Let's redirect /admin/login to /login if needed, or just keep it. 
            User didn't specify path, just "Update App.jsx". 
            Standard is /login /register. 
        */}
        <Route path="/admin/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />{" "}
            {/* Fix for /admin/dashboard 404 */}
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="create-article" element={<ArticleEditorPage />} />
            <Route path="articles/new" element={<ArticleEditorPage />} />
            <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
          </Route>
        </Route>
      </Routes>
    </HelmetProvider>
  );
}

export default App;
