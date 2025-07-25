// VENUEKU-FE/src/pages/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (authLoading) return; // Jika AuthContext masih loading, tunggu

            if (!isLoggedIn) {
                setError('Anda harus login untuk melihat riwayat pesanan.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/my-orders'); // Panggil API terproteksi
                setOrders(response.data);
            } catch (err) {
                console.error('Gagal mengambil orders:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [isLoggedIn, authLoading]); // Trigger fetch saat status login atau authLoading berubah

    if (loading || authLoading) return <p className="text-center py-12">Memuat riwayat pesanan...</p>;
    if (error) return <p className="text-center py-12 text-red-500">Error: {error}</p>;

    // Cek jika orders kosong setelah loading selesai
    if (!loading && !authLoading && orders.length === 0) {
        return <p className="text-center py-12 text-gray-600">Tidak ada pesanan ditemukan.</p>;
    }

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Riwayat Pesanan Anda</h1>
            <p className="text-gray-600 text-center mb-8">Daftar riwayat pesanan lapangan yang telah Anda lakukan.</p>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lapangan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.venue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.field}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dateTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800' :
                                            order.paymentStatus === 'Pending' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Rp{order.totalPrice?.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MyOrdersPage;