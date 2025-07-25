import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCookie } from '../../utils/cookies';

function AdminContactPaymentPage() {
    // Mengambil state dan fungsi dari AuthContext
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk data form (khusus kolom kontak dan QRIS)
    const [contactInstagram, setContactInstagram] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [qrisImageFile, setQrisImageFile] = useState(null); // File untuk qris_image_url

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
                setContactInstagram(itemToEdit.contact_instagram || '');
                setContactPhone(itemToEdit.contact_phone || '');
                setQrisImageFile(null); // File input tidak bisa diisi otomatis
                setErrors({}); // Bersihkan error saat edit
            }
        } else {
            clearForm(); // Reset form saat tidak ada yang diedit
        }
    }, [editingId, existingVenues]); // existingVenues sebagai dependency agar form terisi ulang jika data di tabel berubah

    // --- Fungsi Penanganan Form ---

    const clearForm = () => {
        setContactInstagram('');
        setContactPhone('');
        setQrisImageFile(null);
        setEditingId(null); // Keluar dari mode edit
        setErrors({}); // Hapus error validasi sebelumnya
    };

    const handleQrisImageChange = (e) => {
        setQrisImageFile(e.target.files[0]);
    };

    const handleAddOrUpdateVenue = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors saat mencoba submit

        // Validasi frontend dasar
        // Tidak ada field wajib di sini, karena Instagram/Telepon/QRIS bisa opsional
        // Anda bisa tambahkan validasi jika ingin salah satu wajib diisi

        // Cek autentikasi dan role
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            alert('Anda tidak memiliki izin untuk melakukan operasi ini. Silakan login sebagai Admin atau Superadmin.');
            return;
        }

        // Pastikan ada venue yang sedang diedit
        if (editingId === null) {
            alert('Pilih venue yang ingin diedit dari tabel di bawah.');
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
        formData.append('_method', 'PUT'); // Selalu PUT karena ini halaman edit

        // HANYA append field yang dikelola di halaman ini
        formData.append('contact_instagram', contactInstagram);
        formData.append('contact_phone', contactPhone);

        // Tambahkan file QRIS jika ada
        if (qrisImageFile) {
            formData.append('qris_image_url', qrisImageFile); // Nama key harus sesuai di backend
        } else { // Jika tidak ada file QRIS baru, kirim URL yang sudah ada (jika ada)
            const currentVenue = existingVenues.find(item => item.id === editingId);
            if (currentVenue && currentVenue.qris_image_url) {
                // If no new file, and there's an existing URL, keep it.
                // The backend should handle if this field is missing or empty based on logic.
                // For a PUT request, omitting a field usually means no change unless explicitly handled.
                // If your backend needs it to be sent even if unchanged, you can uncomment this:
                // formData.append('qris_image_url', currentVenue.qris_image_url);
            } else {
                // If no new file and no old URL, explicitly send empty string to clear it on backend
                formData.append('qris_image_url', '');
            }
        }

        try {
            // OPERASI UTAMA DI HALAMAN INI: UPDATE VENUE
            // Rute update venue admin: /admin/venues/{id}
            await api.post(`/admin/venues/${editingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                },
            });
            alert('Informasi Kontak & Pembayaran berhasil diperbarui!');
            fetchVenues(); // Refresh data di tabel
            clearForm(); // Bersihkan form
        } catch (error) {
            console.error('Save error:', error.response ? error.response.data : error.message);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Validasi gagal. Mohon periksa input Anda.');
            } else {
                alert('Terjadi kesalahan saat menyimpan data: ' + (error.response?.data?.message || error.message));
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
        <div className="p-4 sm:p-6 lg:p-8"> {/* Adjusted padding for responsiveness */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Informasi Kontak & Pembayaran Venue</h1>

            ---

            {/* Form Edit Info Kontak & Pembayaran */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? '✏ Edit Kontak & Pembayaran' : 'Pilih Venue untuk Edit Kontak & Pembayaran'}
                </h2>
                <form onSubmit={handleAddOrUpdateVenue} className="space-y-4">
                    {/* Pesan instruksi jika belum memilih venue untuk diedit */}
                    {existingVenues.length > 0 && editingId === null && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                                Pilih Venue dari tabel "Daftar Venue Anda" di bawah untuk mulai mengedit informasi kontak dan pembayaran.
                            </div>
                    )}
                    {existingVenues.length === 0 && !loading && (
                            <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                                Tidak ada venue ditemukan. Silakan tambahkan venue baru melalui halaman Manajemen Venue Utama terlebih dahulu.
                            </div>
                    )}

                    {/* Input Kontak Instagram */}
                    <div>
                        <label htmlFor="contactInstagram" className="block text-sm font-medium text-gray-700">
                            Instagram
                        </label>
                        <input
                            type="text"
                            id="contactInstagram"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="mis. @nama_instagram_venue"
                            value={contactInstagram}
                            onChange={(e) => setContactInstagram(e.target.value)}
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {errors.contact_instagram && <p className="text-red-500 text-sm mt-1">{errors.contact_instagram[0]}</p>}
                    </div>

                    {/* Input Kontak Telepon */}
                    <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                            Telepon
                        </label>
                        <input
                            type="text"
                            id="contactPhone"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="mis. +6281234567890"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone[0]}</p>}
                    </div>

                    {/* Input Foto QRIS */}
                    <div>
                        <label htmlFor="qrisImageFile" className="block text-sm font-medium text-gray-700">
                            Foto QRIS
                        </label>
                        <input
                            type="file"
                            id="qrisImageFile"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
                            onChange={handleQrisImageChange}
                            accept="image/*"
                            disabled={editingId === null} // Nonaktifkan input jika belum memilih venue
                        />
                        {qrisImageFile && <p className="text-sm text-gray-600 mt-2">File terpilih: {qrisImageFile.name}</p>}
                        {editingId && existingVenues.find(item => item.id === editingId)?.qris_image_url && !qrisImageFile && (
                            <p className="text-sm text-gray-600 mt-2">
                                Foto QRIS yang sudah ada: <a href={existingVenues.find(item => item.id === editingId).qris_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Foto</a>
                            </p>
                        )}
                        {errors.qris_image_url && <p className="text-red-500 text-sm mt-1">{errors.qris_image_url[0]}</p>}
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
                            Perbarui Info
                        </button>
                    </div>
                </form>
            </div>

            ---

            {/* Tabel Daftar Venue */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-2">Daftar Venue Anda</h2> {/* Adjusted padding */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Venue</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QRIS</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {existingVenues.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center px-4 py-4 text-gray-500"> {/* Adjusted px */}
                                        Tidak ada data venue ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                existingVenues.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm text-gray-600">{item.id}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{item.name || 'N/A'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{item.contact_instagram || '-'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{item.contact_phone || '-'}</td>
                                        <td className="px-4 py-4">
                                            {item.qris_image_url ? (
                                                <img src={item.qris_image_url} alt="QRIS" className="h-10 w-16 object-cover rounded shadow" />
                                            ) : (
                                                <div className="h-10 w-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">No QRIS</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 space-x-2">
                                            <button
                                                onClick={() => setEditingId(item.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition duration-200 ml-2"
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

export default AdminContactPaymentPage;