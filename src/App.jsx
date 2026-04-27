import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ListingDetailPage from './pages/ListingDetailPage';
import SearchPage from './pages/SearchPage';
import MapPage from './pages/MapPage';
import FavoritesPage from './pages/student/FavoritesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import AddListingPage from './pages/owner/AddListingPage';
import EditListingPage from './pages/owner/EditListingPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner spinner-lg" /><p className="text-muted">Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/favorites" element={<PrivateRoute roles={['student']}><FavoritesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['student']}><StudentProfilePage /></PrivateRoute>} />
          <Route path="/owner/dashboard" element={<PrivateRoute roles={['owner']}><OwnerDashboardPage /></PrivateRoute>} />
          <Route path="/owner/listings/new" element={<PrivateRoute roles={['owner']}><AddListingPage /></PrivateRoute>} />
          <Route path="/owner/listings/:id/edit" element={<PrivateRoute roles={['owner']}><EditListingPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/verifications" element={<PrivateRoute roles={['admin']}><AdminVerificationsPage /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsersPage /></PrivateRoute>} />
          <Route path="/admin/listings" element={<PrivateRoute roles={['admin']}><AdminListingsPage /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute roles={['admin']}><AdminReportsPage /></PrivateRoute>} />
          <Route path="/admin/universities" element={<PrivateRoute roles={['admin']}><AdminUniversitiesPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
            success: { iconTheme: { primary: '#10B981', secondary: '#FFFFFF' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } },
          }} />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
