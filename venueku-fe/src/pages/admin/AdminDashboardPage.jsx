// VENUEKU-FE/src/pages/Admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <<< Import instance API Anda
import { useAuth } from '../../contexts/AuthContext'; // <<< Import useAuth untuk cek role

function AdminDashboardPage() {
    // State untuk metrik, diinisialisasi dengan 0
    const [metrics, setMetrics] = useState({
        totalBookingsToday: 0,
        activeFields: 0,
        revenueThisMonth: 0,
    });
    const [loading, setLoading] = useState(true); // Status loading data dari backend
    const [error, setError] = useState(null); // Status error dari backend
    const { userRole, loading: authLoading } = useAuth(); // Dapatkan userRole dan loading autentikasi dari Context

    useEffect(() => {
        const fetchMetrics = async () => {
            // Jika AuthContext masih loading, tunggu dulu
            if (authLoading) return;

            // Pastikan user memiliki role yang diizinkan untuk mengakses dashboard ini
            if (userRole !== 'admin' && userRole !== 'superadmin') {
                setError('Akses ditolak. Halaman ini hanya untuk Admin atau Superadmin.');
                setLoading(false); // Selesai loading karena akses ditolak
                return;
            }

            setLoading(true); // Mulai loading saat fetch data
            setError(null); // Reset error
            try {
                // <<< PANGGIL API UNTUK MENDAPATKAN METRIK DASHBOARD NYATA >>
                const response = await api.get('/admin/dashboard-metrics');
                setMetrics(response.data); // Set metrik dari respons backend
            } catch (err) {
                console.error('Gagal mengambil metrik dashboard:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Gagal memuat metrik dashboard.');
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        fetchMetrics();
    }, [userRole, authLoading]); // Re-fetch jika userRole atau authLoading berubah

    // Tampilkan loading, error, atau pesan akses ditolak
    if (loading || authLoading) return <p className="text-center text-xl mt-8">Memuat dashboard Admin...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    // Jika akses ditolak, tampilkan pesan ini
    if (userRole !== 'admin' && userRole !== 'superadmin') {
        return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Admin atau Superadmin.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Bookings Today</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalBookingsToday}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Active Fields</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.activeFields}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Revenue This Month</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">Rp{metrics.revenueThisMonth?.toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Bagian lain dari dashboard bisa ditambahkan di sini (grafik, daftar booking terbaru, dll.) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Activities</h2>
                <p className="text-gray-600">Recent bookings and field updates will appear here.</p>
            </div>
        </div>
    );
}

export default AdminDashboardPage;