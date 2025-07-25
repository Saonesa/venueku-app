// src/pages/Admin/AdminPaymentManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCookie } from '../../utils/cookies';

function AdminPaymentManagementPage() {
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk filter
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterField, setFilterField] = useState('');

    // States untuk data transaksi
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Fungsi untuk mengambil data pembayaran dari API
    const fetchPayments = useCallback(async () => {
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            setFetchError("Anda tidak memiliki akses. Silakan login sebagai Admin atau Superadmin.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setFetchError(null);

            const queryParams = new URLSearchParams();
            if (filterStatus) queryParams.append('status', filterStatus.toLowerCase());
            if (filterUser) queryParams.append('user_name', filterUser);
            if (filterField) queryParams.append('field_name', filterField);

            const response = await api.get(`/admin/payments?${queryParams.toString()}`);
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error.response ? error.response.data : error.message);
            let errorMessage = "Gagal memuat data pembayaran. Pastikan API berjalan dan Anda terautentikasi.";
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini. (Pastikan Anda admin dari venue ini)";
            }
            setFetchError(errorMessage);
            setLoading(false);
        }
    }, [filterStatus, filterUser, filterField, isLoggedIn, user]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    // Fungsi untuk memperbarui status pembayaran (generik)
    const handleUpdatePaymentStatus = async (id, newStatus) => {
        if (!window.confirm(`Apakah Anda yakin ingin mengubah status pembayaran ID ${id} menjadi ${newStatus}?`)) {
            return;
        }

        setIsSubmitting(true);
        try {
            await fetchCsrfCookie();
            const csrfToken = getCookie('XSRF-TOKEN');
            if (!csrfToken) {
                alert('CSRF token tidak ditemukan. Coba refresh halaman.');
                return;
            }

            await api.put(`/admin/payments/${id}`, { payment_status: newStatus.toLowerCase() }, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert(`Status pembayaran ID ${id} berhasil diubah menjadi ${newStatus}!`);
            fetchPayments();
        } catch (error) {
            console.error('Error updating payment status:', error.response ? error.response.data : error.message);
            alert(`Gagal memperbarui status pembayaran: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi untuk membersihkan semua filter
    const handleClearFilters = () => {
        setFilterStatus('');
        setFilterUser('');
        setFilterField('');
    };

    // Menampilkan status loading atau error saat fetch awal atau saat tidak ada transaksi
    if (loading && transactions.length === 0 && !fetchError) {
        return <div className="text-center py-8 text-gray-700">Memuat data transaksi pembayaran...</div>;
    }

    if (fetchError) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan: {fetchError}</div>;
    }

    // Cek apakah admin ini memiliki venue (dari user object di AuthContext)
    const hasVenue = user && user.managed_venues && user.managed_venues.length > 0;

    // Pesan khusus jika tidak ada transaksi yang ditemukan (setelah loading selesai dan tidak ada error)
    if (transactions.length === 0 && !loading && !fetchError) {
        if (user?.role === 'admin' && !hasVenue) {
            return (
                <div className="p-6 text-center text-gray-700">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pembayaran</h1>
                    <p className="text-xl mb-4">Anda belum memiliki venue yang terdaftar.</p>
                    <p>Silakan daftarkan venue Anda melalui halaman <strong className="text-blue-600">Manajemen Venue Utama</strong> terlebih dahulu untuk dapat melihat dan mengelola pembayaran.</p>
                </div>
            );
        }
        return (
           <div className="p-6 text-center text-gray-700">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pembayaran</h1>
               <p className="text-xl mb-4">Tidak ada transaksi pembayaran yang masuk untuk venue Anda saat ini.</p>
               <p>Coba sesuaikan filter atau cek kembali nanti.</p>
           </div>
        );
    }


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pembayaran</h1>

            {/* Filter/Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    placeholder="Cari Nama Pengguna"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    disabled={isSubmitting}
                />
                 <input
                    type="text"
                    placeholder="Cari Nama Lapangan"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                    disabled={isSubmitting}
                />
                <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    disabled={isSubmitting}
                >
                    <option value="">Semua Status Pembayaran</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button
                    onClick={handleClearFilters}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 w-full md:w-auto transition duration-200"
                    disabled={isSubmitting}
                >
                    Bersihkan Filter
                </button>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaksi Terbaru</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID Transaksi
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pengguna
                                </th>
                                {/* PERBAIKAN: Kolom Venue & Lapangan Dihapus */}
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal Booking
                                </th>
                                {/* PERBAIKAN: Kolom Waktu Booking Dihapus */}
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jumlah
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metode Pembayaran
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Pembayaran
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-sm text-gray-500 text-center"> {/* colSpan disesuaikan */}
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-sm text-gray-500 text-center"> {/* colSpan disesuaikan */}
                                        Tidak ada transaksi ditemukan yang cocok dengan kriteria Anda.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="px-3 py-2 text-sm font-medium text-gray-900">{tx.id}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500">{tx.user_name}</td>
                                        {/* PERBAIKAN: Kolom Venue, Lapangan, Waktu Booking Dihapus dari Body */}
                                        <td className="px-3 py-2 text-sm text-gray-500">{tx.booking_date}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500">
                                            IDR {tx.total_price ? parseInt(tx.total_price).toLocaleString('id-ID') : '0'}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-500 capitalize">{tx.payment_method || '-'}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                                                ${tx.payment_status === 'paid' || tx.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                                {tx.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-sm font-medium">
                                            {/* Tombol Confirm Payment (Pending -> Paid) */}
                                            {tx.payment_status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdatePaymentStatus(tx.id, 'paid')}
                                                    className="text-blue-600 hover:text-green-900 mr-4 transition duration-200"
                                                    disabled={isSubmitting}
                                                >
                                                    PAID
                                                </button>
                                            )}
                                            {/* Tombol Mark as Completed (Paid -> Completed) */}
                                            {tx.payment_status === 'paid' && (
                                                <button
                                                    onClick={() => handleUpdatePaymentStatus(tx.id, 'completed')}
                                                    className="text-green-600 hover:text-green-900 mr-4 transition duration-200"
                                                    disabled={isSubmitting}
                                                >
                                                    SUBMIT
                                                </button>
                                            )}
                                            {/* Tombol Cancel Payment (selain Cancelled dan Failed) */}
                                            {tx.payment_status !== 'cancelled' && tx.payment_status !== 'failed' && (
                                                <button
                                                    onClick={() => handleUpdatePaymentStatus(tx.id, 'cancelled')}
                                                    className="text-red-600 hover:text-green-900 mr-4 transition duration-200"
                                                    disabled={isSubmitting}
                                                >
                                                    CANCEL
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminPaymentManagementPage;