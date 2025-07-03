// src/pages/Admin/AdminDashboardPage.jsx - KODE INI SUDAH BENAR
import React, { useState, useEffect } from 'react';

function AdminDashboardPage() {
    // Data dummy untuk Key Metrics
    const [metrics, setMetrics] = useState({
        totalBookingsToday: 124,
        activeFields: 48,
        revenueThisMonth: 15200, // Dalam USD, sesuai mockup
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi fetch data dari backend untuk metrics
        setTimeout(() => {
            // Anda akan mengganti ini dengan panggilan API ke backend Sahrul
            setMetrics({
                totalBookingsToday: Math.floor(Math.random() * 200) + 50,
                activeFields: Math.floor(Math.random() * 50) + 10,
                revenueThisMonth: Math.floor(Math.random() * 20000) + 5000,
            });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div> {/* Div ini akan menerima padding dari AdminSidebarLayout */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Bookings Today</h3>
                    {loading ? (
                        <p className="text-2xl font-bold text-gray-800 mt-2 animate-pulse">...</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalBookingsToday}</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Active Fields</h3>
                    {loading ? (
                        <p className="text-2xl font-bold text-gray-800 mt-2 animate-pulse">...</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.activeFields}</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Revenue This Month</h3>
                    {loading ? (
                        <p className="text-2xl font-bold text-gray-800 mt-2 animate-pulse">...</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">${metrics.revenueThisMonth.toLocaleString()}</p>
                    )}
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