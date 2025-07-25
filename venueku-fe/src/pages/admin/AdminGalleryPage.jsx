// src/pages/Admin/AdminGalleryPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import { getCookie } from '../../utils/cookies'; // Import getCookie untuk CSRF

function AdminGalleryPage() {
    // Mengambil state dan fungsi dari AuthContext
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk data form
    const [venueId, setVenueId] = useState(''); // Untuk mengaitkan item galeri dengan venue
    const [highlightName, setHighlightName] = useState(''); // Nama highlight/deskripsi gambar
    const [file, setFile] = useState(null); // File gambar yang akan diunggah

    // States untuk data tabel
    const [existingGallery, setExistingGallery] = useState([]);
    const [venues, setVenues] = useState([]); // Daftar venue untuk dropdown

    // States untuk UI/Interaksi
    const [editingId, setEditingId] = useState(null); // ID item galeri yang sedang diedit
    const [errors, setErrors] = useState({}); // Untuk menampilkan error validasi dari backend
    const [loading, setLoading] = useState(true); // Status loading untuk pengambilan data
    const [fetchError, setFetchError] = useState(null); // Status error jika ada masalah saat fetching

    // --- Fungsi Pengambilan Data ---

    const fetchGalleryItems = async () => {
        // Cek autentikasi dan role sebelum fetch data terproteksi
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            setFetchError("Anda tidak memiliki akses. Silakan login sebagai Admin atau Superadmin.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Mengambil item galeri dari rute admin
            const response = await api.get('/admin/gallery');
            setExistingGallery(response.data); // Asumsi GalleryController@index mengembalikan langsung array of gallery items
            setLoading(false);
            setFetchError(null); // Bersihkan error jika berhasil
        } catch (error) {
            console.error('Error fetching gallery items:', error.response ? error.response.data : error.message);
            let errorMessage = "Gagal memuat data galeri. Pastikan API berjalan dan Anda terautentikasi.";
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini.";
            }
            setFetchError(errorMessage);
            setLoading(false);
        }
    };

    const fetchVenues = async () => {
        // Rute /venues adalah public
        try {
            const response = await api.get('/venues');
            setVenues(response.data);
        } catch (err) {
            console.error('Failed to load venues:', err.response ? err.response.data : err.message);
            // Anda bisa setFetchError di sini juga jika ingin menampilkan error pemuatan venue
        }
    };

    // --- useEffect Hooks ---

    // Effect untuk fetch data galeri dan venue saat komponen dimuat atau status login berubah
    useEffect(() => {
        if (isLoggedIn) { // Hanya fetch jika user sudah login
            fetchGalleryItems();
            fetchVenues();
        } else {
            setLoading(false);
            setFetchError("Silakan login untuk mengelola galeri.");
        }
    }, [isLoggedIn, user]); // Dependencies: isLoggedIn dan user

    // Effect untuk mengisi form saat mode edit diaktifkan
    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingGallery.find(item => item.id === editingId);
            if (itemToEdit) {
                setVenueId(itemToEdit.venue_id || ''); // Isi venue ID
                setHighlightName(itemToEdit.caption || ''); // PERBAIKAN: Menggunakan 'caption' dari BE
                setFile(null); // File input tidak bisa diisi otomatis karena alasan keamanan
                setErrors({}); // Bersihkan error saat edit
            }
        } else {
            clearForm(); // Reset form saat tidak ada yang diedit
        }
    }, [editingId, existingGallery]); // existingGallery sebagai dependency agar form terisi ulang

    // --- Fungsi Penanganan Form ---

    const clearForm = () => {
        setVenueId('');
        setHighlightName('');
        setFile(null);
        setEditingId(null); // Keluar dari mode edit
        setErrors({}); // Hapus error validasi sebelumnya
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddOrUpdateGallery = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors saat mencoba submit

        // Validasi frontend dasar
        if (!venueId || !highlightName || (!file && !editingId)) { // File wajib jika menambah baru atau jika edit tapi tidak ada file sebelumnya
            alert('Mohon lengkapi Venue, Nama Highlight, dan Unggah Foto!');
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
        formData.append('venue_id', venueId);
        formData.append('caption', highlightName); // PERBAIKAN: Menggunakan 'caption' untuk backend

        if (file) {
            formData.append('image_url', file); // Nama key harus sesuai dengan yang diterima di backend Laravel untuk file gambar
        } else if (editingId) {
            // Jika dalam mode edit dan tidak ada file baru diunggah,
            // sertakan image_url yang sudah ada agar backend tidak menghapusnya
            const currentItem = existingGallery.find(item => item.id === editingId);
            if (currentItem && currentItem.image_url) {
                formData.append('image_url', currentItem.image_url); // Kirim kembali URL lama
            }
        }

        try {
            if (editingId) {
                // UPDATE GALLERY ITEM: Menggunakan POST dengan _method=PUT untuk FormData
                formData.append('_method', 'PUT'); // Penting untuk PUT/PATCH dengan FormData di Laravel
                // Rute update galeri admin: /admin/gallery/{id}
                await api.post(`/admin/gallery/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Item galeri berhasil diperbarui!');
            } else {
                // ADD NEW GALLERY ITEM
                // Rute tambah galeri admin: /admin/gallery (POST)
                await api.post('/admin/gallery', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Item galeri berhasil ditambahkan!');
            }
            fetchGalleryItems(); // Refresh data di tabel
            clearForm(); // Bersihkan form
        } catch (error) {
            console.error('Save error:', error.response ? error.response.data : error.message);
            if (error.response?.status === 422) {
                // PERBAIKAN: Cek juga error untuk 'caption'
                setErrors(error.response.data.errors || {});
                alert('Validasi gagal. Mohon periksa input Anda.');
            } else {
                alert('Terjadi kesalahan saat menyimpan item galeri: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) {
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
            // Rute delete galeri admin: /admin/gallery/{id}
            await api.delete(`/admin/gallery/${id}`, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert('Item galeri berhasil dihapus!');
            fetchGalleryItems(); // Refresh data di tabel
        } catch (error) {
            console.error('Delete error:', error.response ? error.response.data : error.message);
            alert('Terjadi kesalahan saat menghapus item galeri: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- Render Komponen ---

    // Tampilkan status loading atau error saat fetch awal
    if (loading) {
        return <div className="text-center py-8 text-gray-700">Memuat data galeri...</div>;
    }

    if (fetchError) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan: {fetchError}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Galeri Venue</h1>

            ---

            {/* Form Tambah/Edit Item Galeri */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? '✏ Edit Item Galeri' : 'Tambah Item Galeri Baru'}</h2>
                <form onSubmit={handleAddOrUpdateGallery} className="space-y-4">
                    {/* Input Venue ID */}
                    <div>
                        <label htmlFor="venueId" className="block text-gray-700 text-sm font-bold mb-2">Pilih Venue</label>
                        <select
                            id="venueId"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={venueId}
                            onChange={(e) => setVenueId(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Venue --</option>
                            {venues.map(venue => (
                                <option key={venue.id} value={venue.id}>{venue.name}</option>
                            ))}
                        </select>
                        {errors.venue_id && <p className="text-red-500 text-sm mt-1">{errors.venue_id[0]}</p>}
                    </div>

                    {/* Input Nama Highlight */}
                    <div>
                        <label htmlFor="highlightName" className="block text-gray-700 text-sm font-bold mb-2">Nama Highlight / Deskripsi Foto</label>
                        <input
                            type="text"
                            id="highlightName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="mis. Pemandangan Lapangan Utama"
                            value={highlightName}
                            onChange={(e) => setHighlightName(e.target.value)}
                            required
                        />
                        {/* PERBAIKAN: Menampilkan error untuk 'caption' jika ada */}
                        {errors.caption && <p className="text-red-500 text-sm mt-1">{errors.caption[0]}</p>}
                    </div>

                    {/* Input Upload Foto */}
                    <div>
                        <label htmlFor="uploadGalleryPhoto" className="block text-gray-700 text-sm font-bold mb-2">Unggah Foto Galeri</label>
                        <input
                            type="file"
                            id="uploadGalleryPhoto"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            accept="image/*"
                            required={!editingId} // Wajib jika menambah baru, tidak wajib jika edit (bisa pakai foto lama)
                        />
                        {file && <p className="text-sm text-gray-600 mt-2">File terpilih: {file.name}</p>}
                        {/* Menampilkan link foto yang sudah ada saat edit, jika tidak ada file baru dipilih */}
                        {editingId && existingGallery.find(item => item.id === editingId)?.image_url && !file && (
                            <p className="text-sm text-gray-600 mt-2">
                                Foto yang sudah ada: <a href={existingGallery.find(item => item.id === editingId).image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Foto</a>
                            </p>
                        )}
                        {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url[0]}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={clearForm}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Bersihkan Form
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {editingId ? 'Perbarui Galeri' : 'Tambah Galeri'}
                        </button>
                    </div>
                </form>
            </div>

            ---

            {/* Tabel Item Galeri yang Ada */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Galeri yang Ada</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Venue
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Highlight
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Foto
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {existingGallery.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Tidak ada item galeri ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                existingGallery.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {venues.find(v => v.id === item.venue_id)?.name || 'N/A'}
                                        </td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.caption}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="Gallery Item" className="w-16 h-10 object-cover rounded-md" />
                                            ) : (
                                                <div className="h-10 w-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">No Image</div>
                                            )}
                                        </td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
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

export default AdminGalleryPage;