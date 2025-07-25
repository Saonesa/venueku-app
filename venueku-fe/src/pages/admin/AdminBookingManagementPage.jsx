// src/pages/Admin/AdminBookingManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCookie } from '../../utils/cookies';

function AdminBookingManagementPage() {
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth(); // Ambil user untuk akses user.id

    // States untuk filter
    const [filterField, setFilterField] = useState(''); // Filter berdasarkan nama lapangan
    const [filterStatus, setFilterStatus] = useState(''); // Filter berdasarkan status booking
    const [filterUser, setFilterUser] = useState(''); // Filter berdasarkan nama pengguna

    // States untuk data booking
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Status loading untuk fetch data tabel
    const [isSubmitting, setIsSubmitting] = useState(false); // Status loading untuk aksi konfirmasi/batal
    const [fetchError, setFetchError] = useState(null);

    // Fungsi untuk mengambil data booking dari API
    const fetchBookings = useCallback(async () => {
        // Cek autentikasi dan role admin (Backend juga melakukan ini)
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            setFetchError("Anda tidak memiliki akses. Silakan login sebagai Admin atau Superadmin.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setFetchError(null);

            const queryParams = new URLSearchParams();
            if (filterField) queryParams.append('field_name', filterField);
            if (filterStatus) queryParams.append('status', filterStatus.toLowerCase()); // Kirim status lowercase ke BE
            if (filterUser) queryParams.append('user_name', filterUser);

            // Backend akan memfilter booking berdasarkan admin_id user yang login
            const response = await api.get(`/admin/bookings?${queryParams.toString()}`);
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            let errorMessage = "Gagal memuat data pemesanan. Pastikan API berjalan dan Anda terautentikasi.";
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini. (Pastikan Anda admin dari venue ini)";
            }
            setFetchError(errorMessage);
            setLoading(false);
        }
    }, [filterField, filterStatus, filterUser, isLoggedIn, user]);

    // Effect untuk memuat booking saat komponen mount atau filter/login berubah
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Fungsi untuk mengkonfirmasi pemesanan
    const handleConfirm = async (id) => {
        if (!window.confirm(`Apakah Anda yakin ingin mengkonfirmasi pemesanan ID ${id}?`)) {
            return;
        }

        setIsSubmitting(true); // Set loading untuk aksi
        try {
            await fetchCsrfCookie();
            const csrfToken = getCookie('XSRF-TOKEN');
            if (!csrfToken) {
                alert('CSRF token tidak ditemukan. Coba refresh halaman.');
                return;
            }

            await api.put(`/admin/bookings/${id}/confirm`, {}, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert(`Pemesanan ID ${id} berhasil Dikonfirmasi!`);
            fetchBookings(); // Refresh daftar booking
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            alert(`Gagal mengkonfirmasi pemesanan: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false); // Selesai loading
        }
    };

    // Fungsi untuk membatalkan pemesanan
    const handleCancel = async (id) => {
        if (!window.confirm(`Apakah Anda yakin ingin membatalkan pemesanan ID ${id}?`)) {
            return;
        }

        setIsSubmitting(true); // Set loading untuk aksi
        try {
            await fetchCsrfCookie();
            const csrfToken = getCookie('XSRF-TOKEN');
            if (!csrfToken) {
                alert('CSRF token tidak ditemukan. Coba refresh halaman.');
                return;
            }

            await api.put(`/admin/bookings/${id}/cancel`, {}, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert(`Pemesanan ID ${id} berhasil Dibatalkan!`);
            fetchBookings(); // Refresh daftar booking
        } catch (error) {
            console.error('Error cancelling booking:', error.response ? error.response.data : error.message);
            alert(`Gagal membatalkan pemesanan: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false); // Selesai loading
        }
    };

    // Fungsi untuk membersihkan semua filter
    const handleClearFilters = () => {
        setFilterField('');
        setFilterStatus('');
        setFilterUser('');
    };

    // Menampilkan status loading atau error
    if (loading && bookings.length === 0 && !fetchError) {
        return <div className="text-center py-8 text-gray-700">Memuat data pemesanan...</div>;
    }

    if (fetchError) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan: {fetchError}</div>;
    }

    // Cek apakah admin ini memiliki venue
    // user.managed_venues akan tersedia jika AuthController@login meng-eager load managedVenues
    const hasVenue = user && user.managed_venues && user.managed_venues.length > 0;

    // Jika admin tidak punya venue dan bukan superadmin
    if (bookings.length === 0 && !loading && !fetchError) {
        if (user?.role === 'admin' && !hasVenue) { // Hanya untuk role 'admin' yang tidak punya venue
            return (
                <div className="p-6 text-center text-gray-700">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pemesanan</h1>
                    <p className="text-xl mb-4">Anda belum memiliki venue yang terdaftar.</p>
                    <p>Silakan daftarkan venue Anda melalui halaman <strong className="text-blue-600">Manajemen Venue Utama</strong> terlebih dahulu untuk dapat melihat dan mengelola pemesanan.</p>
                </div>
            );
        }
        // Jika ada venue tapi tidak ada booking yang cocok filter
        return (
           <div className="p-6 text-center text-gray-700">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pemesanan</h1>
               <p className="text-xl mb-4">Tidak ada pemesanan yang masuk untuk venue Anda saat ini.</p>
               <p>Coba sesuaikan filter atau cek kembali nanti.</p>
           </div>
        );
    }


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pemesanan</h1>

            {/* Filter/Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    placeholder="Cari Nama Lapangan"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                />
                <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter berdasarkan Nama Pengguna"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                />
                <button
                    onClick={handleClearFilters}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 w-full md:w-auto transition duration-200"
                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                >
                    Bersihkan Filter
                </button>
            </div>

            {/* All Bookings Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Semua Pemesanan</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lapangan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal & Waktu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pengguna
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? ( // Tampilkan loading state di tabel juga
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? ( // Ini sudah diatasi oleh conditional rendering di atas
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Tidak ada pemesanan ditemukan yang cocok dengan kriteria Anda.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.field_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {`${booking.booking_date} ${booking.start_time?.substring(0,5)} - ${booking.end_time?.substring(0,5)}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => handleConfirm(booking.id)}
                                                    className="text-blue-600 hover:text-green-900 mr-4 transition duration-200"
                                                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                                                >
                                                    Konfirmasi
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="text-red-600 hover:text-red-900 transition duration-200"
                                                    disabled={isSubmitting} // Nonaktifkan saat aksi submit
                                                >
                                                    Batalkan
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

export default AdminBookingManagementPage;