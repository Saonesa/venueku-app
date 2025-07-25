// src/pages/Admin/AdminAboutPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import { getCookie } from '../../utils/cookies'; // Import getCookie untuk CSRF

function AdminAboutPage() {
    // Mengambil state dan fungsi dari AuthContext
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk data form (khusus kolom yang akan dikelola di halaman ini)
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [facilities, setFacilities] = useState(''); // Mengacu pada facilities_details di BE
    // State contactInstagram, contactPhone, qrisImageFile dihapus dari sini

    // State untuk data yang sudah ada di tabel
    const [existingVenues, setExistingVenues] = useState([]);

    // States untuk UI/Interaksi
    const [editingId, setEditingId] = useState(null); // ID venue yang sedang diedit
    const [errors, setErrors] = useState({}); // Untuk menampilkan error validasi dari backend
    const [loading, setLoading] = useState(true); // Status loading untuk pengambilan data
    const [fetchError, setFetchError] = useState(null); // Status error jika ada masalah saat fetching

    // --- Fungsi Pengambilan Data ---

    const fetchVenues = async () => {
        // Rute /venues adalah public, jadi tidak perlu cek auth/role di sini untuk GET
        try {
            setLoading(true);
            const response = await api.get('/venues');
            // Di aplikasi nyata, Anda mungkin ingin memfilter ini berdasarkan user.venue_id
            setExistingVenues(response.data);
            setLoading(false);
            setFetchError(null); // Bersihkan error jika berhasil
        } catch (error) {
            console.error('Error fetching venues:', error.response ? error.response.data : error.message);
            setFetchError("Gagal memuat data venue. Pastikan API berjalan.");
            setLoading(false);
        }
    };

    // --- useEffect Hooks ---

    // Effect untuk fetch data venues saat komponen dimuat
    useEffect(() => {
        fetchVenues();
    }, []);

    // Effect untuk mengisi form saat mode edit diaktifkan
    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingVenues.find(item => item.id === editingId);
            if (itemToEdit) {
                setDescription(itemToEdit.description || '');
                setAddress(itemToEdit.address || '');
                setFacilities(itemToEdit.facilities_details || ''); // Sesuaikan dengan nama kolom di BE
                // State contactInstagram, contactPhone tidak diisi di sini
                // State qrisImageFile tidak diisi di sini
                setErrors({}); // Bersihkan error saat edit
            }
        } else {
            clearForm(); // Reset form saat tidak ada yang diedit
        }
    }, [editingId, existingVenues]); // existingVenues sebagai dependency agar form terisi ulang jika data di tabel berubah

    // --- Fungsi Penanganan Form ---

    const clearForm = () => {
        setDescription('');
        setAddress('');
        setFacilities('');
        // State contactInstagram, contactPhone, qrisImageFile tidak di-clear di sini
        setEditingId(null); // Keluar dari mode edit
        setErrors({}); // Hapus error validasi sebelumnya
    };

    // handleQrisImageChange dihapus dari sini

    const handleAddOrUpdateVenue = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors saat mencoba submit

        // Validasi frontend dasar untuk field yang dikelola di halaman ini
        if (!description.trim() || !address.trim() || !facilities.trim()) {
            alert('Deskripsi, Alamat, dan Fasilitas wajib diisi.');
            return;
        }

        // Cek autentikasi dan role
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            alert('Anda tidak memiliki izin untuk melakukan operasi ini. Silakan login sebagai Admin atau Superadmin.');
            return;
        }

        // Ambil CSRF cookie sebelum mengirim permintaan POST/PUT
        try {
            await fetchCsrfCookie();
        } catch (csrfErr) {
            alert(csrfErr.message || 'Gagal menyiapkan sesi keamanan. Coba refresh halaman.');
            return;
        }

        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
            alert('CSRF token tidak ditemukan. Coba refresh halaman.');
            return;
        }

        const formData = new FormData();
        // HANYA append field yang dikelola di halaman ini
        formData.append('description', description);
        formData.append('address', address);
        formData.append('facilities_details', facilities); // Pastikan nama kolom di BE adalah facilities_details

        try {
            if (editingId) {
                // OPERASI UTAMA DI HALAMAN INI: UPDATE VENUE
                formData.append('_method', 'PUT'); // Penting untuk PUT/PATCH dengan FormData di Laravel
                // Rute update venue admin: /admin/venues/{id}
                await api.post(`/admin/venues/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Informasi detail Venue berhasil diperbarui!');
            } else {
                // Jika tidak ada editingId, ini berarti admin mencoba "menambah" detail.
                // Sesuai arahan, halaman ini HANYA untuk EDIT detail venue yang sudah ada.
                alert('Operasi "Tambah Info Detail Venue" tidak tersedia di sini. Silakan edit venue yang sudah ada dari tabel di bawah.');
                return; // Hentikan eksekusi
            }
            fetchVenues(); // Refresh data di tabel
            clearForm(); // Bersihkan form
        } catch (error) {
            console.error('Save error:', error.response ? error.response.data : error.message);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Validasi gagal. Mohon periksa input Anda.');
            } else {
                alert('Terjadi kesalahan saat menyimpan data detail venue: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // --- Fungsi Penanganan Hapus ---
    // Fungsi delete ini saya tinggalkan karena ada di template Anda, tetapi lebih baik dikelola
    // di halaman manajemen venue yang lebih umum (AdminVenuePage) jika admin bisa menghapus venue.
    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus venue ini? Ini akan menghapus semua informasi terkait!')) {
            return;
        }

        // Cek autentikasi dan role
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            alert('Anda tidak memiliki izin untuk melakukan operasi ini.');
            return;
        }

        // Ambil CSRF cookie sebelum mengirim permintaan DELETE
        try {
            await fetchCsrfCookie();
        } catch (csrfErr) {
            alert(csrfErr.message || 'Gagal menyiapkan sesi keamanan. Coba refresh halaman.');
            return;
        }

        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
            alert('CSRF token tidak ditemukan. Coba refresh halaman.');
            return;
        }

        try {
            // Rute delete venue admin: /admin/venues/{id}
            await api.delete(`/admin/venues/${id}`, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert('Venue berhasil dihapus!');
            fetchVenues(); // Refresh data di tabel
        } catch (error) {
            console.error('Delete error:', error.response ? error.response.data : error.message);
            alert('Terjadi kesalahan saat menghapus venue: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- Render Komponen ---

    // Tampilkan status loading atau error saat fetch awal
    if (loading) {
        return <div className="text-center py-8 text-gray-700">Memuat data venue...</div>;
    }

    if (fetchError) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan: {fetchError}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Informasi Detail Venue</h1>

            ---

            {/* Form Edit Info Venue */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? '✏ Edit Detail Venue' : 'Pilih Venue untuk Edit Detail'}
                </h2>
                <form onSubmit={handleAddOrUpdateVenue} className="space-y-4">
                    {/* Pesan instruksi jika belum memilih venue untuk diedit */}
                    {existingVenues.length > 0 && editingId === null && (
                         <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                             Pilih Venue dari tabel "Daftar Venue Anda" di bawah untuk mulai mengedit detailnya.
                         </div>
                    )}
                     {existingVenues.length === 0 && !loading && (
                         <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                             Tidak ada venue ditemukan. Silakan tambahkan venue baru melalui halaman Manajemen Venue Utama terlebih dahulu.
                         </div>
                    )}

                    {/* Input Deskripsi */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
                    </div>

                    {/* Input Alamat */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
                    </div>

                    {/* Input Fasilitas */}
                    <div>
                        <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">
                            Fasilitas (pisahkan dengan koma)
                        </label>
                        <input
                            type="text"
                            id="facilities"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="mis. Wifi, Toilet, Parkir, Ruang Ganti"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                            required
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {errors.facilities_details && <p className="text-red-500 text-sm mt-1">{errors.facilities_details[0]}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={clearForm}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                            Bersihkan Form
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={editingId === null} // Nonaktifkan tombol submit jika belum memilih venue
                        >
                            Perbarui Info Detail Venue
                        </button>
                    </div>
                </form>
            </div>

            ---

            {/* Tabel Daftar Venue */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 p-6 mb-2">Daftar Venue Anda</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Venue</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fasilitas</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> {/* Hanya aksi edit/hapus di sini */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {existingVenues.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center px-6 py-4 text-gray-500">
                                        Tidak ada data venue ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                existingVenues.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 line-clamp-2">{item.description || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.address || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.facilities_details || '-'}</td>
                                        {/* Kolom Instagram, Telepon, QRIS dihapus dari tabel ini */}
                                        <td className="px-3 py-2 text-sm font-medium">
                                            <button
                                                onClick={() => setEditingId(item.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition duration-200"
                                            >
                                                Hapus
                                            </button>
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

export default AdminAboutPage;