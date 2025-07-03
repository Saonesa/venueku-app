// src/pages/Admin/AdminSuperadminDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

function AdminSuperadminDashboardPage() {
    const { userRole } = useContext(AuthContext); // Dapatkan userRole dari Context
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        totalPartners: 0,
        overallRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulasi fetch data khusus Superadmin
        const fetchSuperadminMetrics = async () => {
            if (userRole !== 'superadmin') {
                setLoading(false);
                setError('Akses ditolak. Halaman ini hanya untuk Superadmin.');
                return;
            }
            setLoading(true);
            // Di sini Anda akan memanggil manageUsers dari AuthContext untuk mendapatkan jumlah
            // atau API backend Sahrul untuk metrik superadmin yang sebenarnya.
            try {
                // Simulasi data
                const dummyUsers = Math.floor(Math.random() * 1000) + 100;
                const dummyPartners = Math.floor(Math.random() * 100) + 10;
                const dummyRevenue = Math.floor(Math.random() * 50000) + 10000;

                setMetrics({
                    totalUsers: dummyUsers,
                    totalPartners: dummyPartners,
                    overallRevenue: dummyRevenue,
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSuperadminMetrics();
    }, [userRole]); // Re-fetch jika userRole berubah

    if (loading) return <p className="text-center text-xl mt-8">Memuat dashboard Superadmin...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
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
                    <p className="text-3xl font-bold text-gray-800 mt-2">${metrics.overallRevenue.toLocaleString()}</p>
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