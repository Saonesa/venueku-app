// VENUEKU-FE/src/pages/Admin/AdminSuperadminDashboardPage.jsx
import React, { useState, useEffect } from 'react'; // Hapus useContext
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import api from '../../services/api'; // Import api instance

function AdminSuperadminDashboardPage() {
    const { userRole, loading: authLoading } = useAuth(); // Dapatkan userRole dan loading autentikasi
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalPartners: 0,
        overallRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuperadminMetrics = async () => {
            if (authLoading) return; // Tunggu AuthContext selesai loading

            if (userRole !== 'superadmin') {
                setError('Akses ditolak. Halaman ini hanya untuk Superadmin.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // <<< PANGGIL API UNTUK METRIK SUPERADMIN >>>
                const response = await api.get('/superadmin/dashboard-metrics');
                setMetrics(response.data);
            } catch (err) {
                console.error('Gagal mengambil metrik Superadmin:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Gagal memuat metrik Superadmin.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuperadminMetrics();
    }, [userRole, authLoading]); // Re-fetch jika userRole atau authLoading berubah

    if (loading || authLoading) return <p className="text-center text-xl mt-8">Memuat dashboard Superadmin...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    if (userRole !== 'superadmin') return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Superadmin.</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Superadmin Dashboard Overview</h1>

            {/* Key Metrics untuk Superadmin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Registered Users</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Registered Partners</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalPartners}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Overall Revenue (All Time)</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">Rp{metrics.overallRevenue?.toLocaleString('id-ID')}</p> {/* Format mata uang */}
                </div>
            </div>

            {/* Bagian lain khusus Superadmin */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Health & Reports</h2>
                <p className="text-gray-600">Advanced reports and system health monitoring will be available here.</p>
            </div>
        </div>
    );
}

export default AdminSuperadminDashboardPage;