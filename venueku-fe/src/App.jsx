// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VenueListingPage from './pages/VenueListingPage';
import VenueDetailPage from './pages/VenueDetailPage';

// Import Halaman Tab Anak VenueDetailPage
import VenueFieldTab from './pages/VenueFieldTab';
import VenueAboutTab from './pages/VenueAboutTab';
import VenueGalleryTab from './pages/VenueGalleryTab';

// Import Halaman Jadwal Lapangan
import FieldSchedulePage from './pages/FieldSchedulePage';

// Halaman Pembayaran
import PaymentPage from './pages/PaymentPage';

// Halaman Pesanan/Riwayat
import MyOrdersPage from './pages/MyOrdersPage';

// Halaman Profile
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminSidebarLayout from './components/Admin/AdminSidebarLayout';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminAboutPage from './pages/Admin/AdminAboutPage';
import AdminFieldsPage from './pages/Admin/AdminFieldsPage';
import AdminGalleryPage from './pages/Admin/AdminGalleryPage';
import AdminBookingManagementPage from './pages/Admin/AdminBookingManagementPage';
import AdminPaymentManagementPage from './pages/Admin/AdminPaymentManagementPage';
import AdminProfilePage from './pages/Admin/AdminProfilePage';
import AdminUserManagementPage from './pages/Admin/AdminUserManagementPage';
import AdminPartnerManagementPage from './pages/Admin/AdminPartnerManagementPage';
import AdminSuperadminDashboardPage from './pages/Admin/AdminSuperadminDashboardPage';

// Import Halaman Login/Register SPESIFIK per peran
import UserLoginPage from './pages/Auth/UserLoginPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import AdminRegisterPage from './pages/Auth/AdminRegisterPage';
import SuperadminLoginPage from './pages/Auth/SuperadminLoginPage'; // <<< IMPORT BARU

// Import AuthProvider
import { AuthProvider } from './contexts/AuthContext';

// Komponen Layout untuk Halaman Publik/User
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="container mx-auto p-4 min-h-screen">
      <Outlet />
    </main>
    <Footer />
    {/* Tombol WhatsApp Floating */}
    <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 z-50">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24L1.75 17.5l.053-.021A9.878 9.878 0 0 1 0 12c0-5.45 4.43-9.879 9.879-9.879 2.651 0 5.142 1.03 7.027 2.918s2.918 4.376 2.918 7.027c0 5.45-4.43 9.879-9.879 9.879h-.003zm6.545-5.908l-.134-.078c-.206-.118-1.282-.647-1.488-.718-.206-.07-.355-.105-.504.105-.149.21-.575.718-.704.858-.128.14-.257.156-.47-.052-.213-.213-.896-.328-1.705-1.054-.627-.585-1.041-1.396-1.169-1.603-.128-.207-.014-.32.091-.426.091-.091.206-.213.31-.328.105-.116.14-.207.21-.355.07-.149.035-.27-.018-.363-.053-.092-.47-.14-.704-.175-.234-.035-.504-.07-.773-.07-.269 0-.47.105-.704.31-.234.21-.896.883-.896 2.15 0 1.268.913 2.505 1.042 2.68.128.175 1.777 2.704 4.316 3.738 2.539 1.034 2.539.69 2.996.647.458-.046 1.34-.543 1.536-1.096.195-.552.195-1.02.13-1.09z" />
      </svg>
    </a>
  </>
);


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rute Publik/User (dengan Navbar dan Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/venue-listing" element={<VenueListingPage />} />

            {/* Rute Bersarang untuk Detail Venue (masih di dalam PublicLayout) */}
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

            {/* Rute Login/Register Spesifik (masih di dalam PublicLayout) */}
            <Route path="/login/user" element={<UserLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/register/user" element={<UserRegisterPage />} />
            <Route path="/register/admin" element={<AdminRegisterPage />} />
          </Route>

          {/* Rute Admin (TANPA Navbar dan Footer Publik) */}
          <Route path="/admin" element={<AdminSidebarLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="about-admin" element={<AdminAboutPage />} />
            <Route path="fields" element={<AdminFieldsPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="schedule" element={<AdminBookingManagementPage />} />
            <Route path="payments" element={<AdminPaymentManagementPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="users" element={<AdminUserManagementPage />} />
            <Route path="partners" element={<AdminPartnerManagementPage />} />
            <Route path="superadmin-dashboard" element={<AdminSuperadminDashboardPage />} />
          </Route>

          {/* Rute Login Superadmin (Terpisah dari PublicLayout) */}
          <Route path="/superadmin-portal/login" element={<SuperadminLoginPage />} /> {/* <<< RUTE BARU */}

          {/* Fallback untuk rute yang tidak cocok (opsional) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;