// VENUEKU-FE/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebarLayout from './components/Admin/AdminSidebarLayout';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import VenueListingPage from './pages/VenueListingPage.jsx';
import VenueDetailPage from './pages/VenueDetailPage.jsx';
import VenueFieldTab from './pages/VenueFieldTab.jsx'; // Pastikan file ini ada
import VenueAboutTab from './pages/VenueAboutTab.jsx'; // Pastikan file ini ada
import VenueGalleryTab from './pages/VenueGalleryTab.jsx'; // Pastikan file ini ada
import FieldSchedulePage from './pages/FieldSchedulePage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Import Auth Pages
import UserLoginPage from './pages/Auth/UserLoginPage.jsx';
import AdminLoginPage from './pages/Auth/AdminLoginPage.jsx';
import UserRegisterPage from './pages/Auth/UserRegisterPage.jsx';
import SuperadminLoginPage from './pages/Auth/SuperadminLoginPage.jsx';

// Import Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage.jsx';
import AdminVenuePage from './pages/Admin/AdminVenuePage.jsx';
import AdminAboutPage from './pages/Admin/AdminAboutPage.jsx';
import AdminFieldsPage from './pages/Admin/AdminFieldsPage.jsx';
import AdminContactPaymentPage from './pages/Admin/AdminContactPaymentPage.jsx';
import AdminGalleryPage from './pages/Admin/AdminGalleryPage.jsx';
import AdminBookingManagementPage from './pages/Admin/AdminBookingManagementPage.jsx';
import AdminPaymentManagementPage from './pages/Admin/AdminPaymentManagementPage.jsx';
import AdminProfilePage from './pages/Admin/AdminProfilePage.jsx';
import AdminUserManagementPage from './pages/Admin/AdminUserManagementPage.jsx';
import AdminPartnerManagementPage from './pages/Admin/AdminPartnerManagementPage.jsx';
import AdminSuperadminDashboardPage from './pages/Admin/AdminSuperadminDashboardPage.jsx';


// Komponen Layout untuk Halaman Publik/User
const PublicLayout = () => (
    <>
        <Navbar />
        <main className="container mx-auto p-4 min-h-screen">
            <Outlet />
        </main>
        <Footer />
        {/* Tombol WhatsApp Floating (menggunakan SVG baru) */}
        <a href="https://wa.me/6281234567890?text=Halo,%20saya%20punya%20pertanyaan%20tentang%20reservasi%20lapangan%20olahraga." target="_blank" rel="noopener noreferrer"
            className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        </a>
    </>
);

// Komponen untuk Proteksi Rute (di dalam App.jsx)
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, authToken } = useAuth();

    if (loading) {
        return <div className="text-center mt-8">Loading authentication...</div>;
    }

    if (!authToken || !user) {
        return <Navigate to="/login/user" replace />; // Redirect ke login utama
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Jika role tidak diizinkan, bisa redirect ke dashboard atau halaman 403
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Routes> {/* <<< HANYA INI YANG DIBUTUHKAN DI SINI */}
            {/* Rute Publik/User (dengan Navbar dan Footer) */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/venue-listing" element={<VenueListingPage />} />
                <Route path="/venue/:id" element={<VenueDetailPage />}>
                    <Route index element={<Navigate to="field" replace />} />
                    <Route path="field" element={<VenueFieldTab />} />
                    <Route path="about" element={<VenueAboutTab />} />
                    <Route path="gallery" element={<VenueGalleryTab />} />
                </Route>
                <Route path="/venue/:venueId/field/:fieldId/schedule" element={<FieldSchedulePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Rute Login/Register Spesifik */}
                <Route path="/login/user" element={<UserLoginPage />} />
                <Route path="/login/admin" element={<AdminLoginPage />} />
                <Route path="/register/user" element={<UserRegisterPage />} />
            </Route>

            {/* Rute Admin (TANPA Navbar dan Footer Publik) - Diproteksi */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminSidebarLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="venues" element={<AdminVenuePage />} />
                <Route path="about-admin" element={<AdminAboutPage />} />
                <Route path="fields" element={<AdminFieldsPage />} />
                 <Route path="contact-payment" element={<AdminContactPaymentPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="schedule" element={<AdminBookingManagementPage />} />
                <Route path="payments" element={<AdminPaymentManagementPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                {/* Rute Khusus Superadmin (di dalam layout admin) */}
                <Route path="users" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminUserManagementPage /></ProtectedRoute>} />
                <Route path="partners" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminPartnerManagementPage /></ProtectedRoute>} />
                <Route path="superadmin-dashboard" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminSuperadminDashboardPage /></ProtectedRoute>} />
            </Route>

            {/* Rute Login Superadmin (Terpisah dari PublicLayout) - Tidak diproteksi, karena ini halaman loginnya */}
            <Route path="/superadmin-portal/login" element={<SuperadminLoginPage />} />

            {/* Fallback untuk rute yang tidak cocok (opsional) */}
            <Route path="*" element={<NotFoundPage />} /> {/* Mengarahkan ke halaman NotFound */}
        </Routes>
    );
}

export default App;