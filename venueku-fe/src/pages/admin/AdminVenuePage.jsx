// src/pages/Admin/AdminVenuePage.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import { getCookie } from '../../utils/cookies'; // Import getCookie untuk CSRF

function AdminVenuePage() {
    // Mengambil state dan fungsi dari AuthContext
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk data form (sesuai dengan kolom yang akan dikelola di sini)
    const [venueName, setVenueName] = useState('');
    const [location, setLocation] = useState(''); // Kolom 'location' di BE untuk alamat/kota
    const [sportType, setSportType] = useState(''); // Asumsi venue bisa punya sport_type utama
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [mainImageFile, setMainImageFile] = useState(null); // File untuk image_url utama venue

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
            setExistingVenues(response.data);
            setLoading(false);
            setFetchError(null);
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
                setVenueName(itemToEdit.name || '');
                setLocation(itemToEdit.location || '');
                setSportType(itemToEdit.sport_type || '');
                setMinPrice(itemToEdit.min_price?.toString() || ''); // Konversi ke string
                setMaxPrice(itemToEdit.max_price?.toString() || ''); // Konversi ke string
                setMainImageFile(null); // File input tidak bisa diisi otomatis
                setErrors({}); // Bersihkan error saat edit
            }
        } else {
            clearForm(); // Reset form saat tidak ada yang diedit
        }
    }, [editingId, existingVenues]);

    // --- Fungsi Penanganan Form ---

    const clearForm = () => {
        setVenueName('');
        setLocation('');
        setSportType('');
        setMinPrice('');
        setMaxPrice('');
        setMainImageFile(null);
        setEditingId(null); // Keluar dari mode edit
        setErrors({}); // Hapus error validasi sebelumnya
    };

    const handleMainImageChange = (e) => {
        setMainImageFile(e.target.files[0]);
    };

    const handleAddOrUpdateVenue = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors saat mencoba submit

        // Validasi frontend dasar
        if (!venueName.trim() || !location.trim() || !sportType.trim() || !minPrice || !maxPrice) {
            alert('Semua field wajib diisi (Nama, Lokasi, Jenis Olahraga, Min Harga, Max Harga).');
            return;
        }
        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            alert('Minimal harga tidak boleh lebih besar dari Maksimal harga.');
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
        formData.append('name', venueName);
        formData.append('location', location);
        formData.append('sport_type', sportType);
        formData.append('min_price', parseFloat(minPrice));
        formData.append('max_price', parseFloat(maxPrice));

        // Tambahkan file gambar utama jika ada
        if (mainImageFile) {
            formData.append('image_url', mainImageFile); // Nama key harus sesuai dengan yang diterima di backend Laravel
        } else if (editingId) {
            // Jika dalam mode edit dan tidak ada file baru diunggah, kirimkan URL lama
            const currentVenue = existingVenues.find(item => item.id === editingId);
            if (currentVenue && currentVenue.image_url) {
                formData.append('image_url', currentVenue.image_url);
            }
        }


        try {
            let response;
            if (editingId) {
                // UPDATE VENUE: Menggunakan POST dengan _method=PUT untuk FormData
                formData.append('_method', 'PUT'); // Penting untuk PUT/PATCH dengan FormData di Laravel
                // Rute update venue admin: /admin/venues/{id}
                response = await api.post(`/admin/venues/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Informasi Venue berhasil diperbarui!');
            } else {
                // ADD NEW VENUE: Ini adalah halaman untuk menambah dan mengedit venue
                response = await api.post('/admin/venues', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Venue baru berhasil ditambahkan!');
            }
            fetchVenues(); // Refresh data di tabel
            clearForm(); // Bersihkan form
        } catch (error) {
            console.error('Save error:', error.response ? error.response.data : error.message);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Validasi gagal. Mohon periksa input Anda.');
            } else {
                alert('Terjadi kesalahan saat menyimpan data venue: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // --- Fungsi Penanganan Hapus ---

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Venue Utama</h1>

            {/* Form Tambah/Edit Venue Utama */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? '✏ Edit Informasi Dasar Venue' : 'Tambah Venue Baru'}
                </h2>
                <form onSubmit={handleAddOrUpdateVenue} className="space-y-4">
                    {/* Input Nama Venue */}
                    <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                            Nama Venue
                        </label>
                        <input
                            type="text"
                            id="venueName"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                    </div>

                    {/* Input Lokasi */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Lokasi (Kota/Alamat Singkat)
                        </label>
                        <input
                            type="text"
                            id="location"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="mis. Jakarta, Bandung, Surabaya"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location[0]}</p>}
                    </div>

                    {/* Input Jenis Olahraga Utama */}
                    <div>
                        <label htmlFor="sportType" className="block text-sm font-medium text-gray-700">
                            Jenis Olahraga Utama Venue
                        </label>
                        <select
                            id="sportType"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={sportType}
                            onChange={(e) => setSportType(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Jenis Olahraga --</option>
                            <option value="Soccer">Sepak Bola</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Badminton">Bulu Tangkis</option>
                            <option value="Basketball">Bola Basket</option>
                            <option value="Tenis">Tenis</option>
                            <option value="Voli">Voli</option>
                            <option value="Renang">Renang</option>
                            <option value="Multi Sport">Multi Olahraga</option>
                        </select>
                        {errors.sport_type && <p className="text-red-500 text-sm mt-1">{errors.sport_type[0]}</p>}
                    </div>

                    {/* Input Harga Minimal */}
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                            Harga Minimal (IDR)
                        </label>
                        <input
                            type="number"
                            id="minPrice"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            required
                        />
                        {errors.min_price && <p className="text-red-500 text-sm mt-1">{errors.min_price[0]}</p>}
                    </div>

                    {/* Input Harga Maksimal */}
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                            Harga Maksimal (IDR)
                        </label>
                        <input
                            type="number"
                            id="maxPrice"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            required
                        />
                        {errors.max_price && <p className="text-red-500 text-sm mt-1">{errors.max_price[0]}</p>}
                    </div>

                    {/* Input Foto Utama Venue */}
                    <div>
                        <label htmlFor="mainImageFile" className="block text-sm font-medium text-gray-700">
                            Foto Utama Venue (Cover)
                        </label>
                        <input
                            type="file"
                            id="mainImageFile"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
                            onChange={handleMainImageChange}
                            accept="image/*"
                        />
                        {mainImageFile && <p className="text-sm text-gray-600 mt-2">File terpilih: {mainImageFile.name}</p>}
                        {editingId && existingVenues.find(item => item.id === editingId)?.image_url && !mainImageFile && (
                            <p className="text-sm text-gray-600 mt-2">
                                Tambahkan gambar baru untuk mengganti foto utama
                            </p>
                        )}
                        {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url[0]}</p>}
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
                        >
                            {editingId ? 'Perbarui Venue' : 'Tambah Venue'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Venue */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 p-6 mb-2">Daftar Venue Anda</h2>
                {/* Tambahkan div ini untuk membuat tabel responsif */}
                <div className="overflow-x-auto"> 
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Nama Venue</th>
                                <th className="px-6 py-3">Lokasi</th>
                                <th className="px-6 py-3">Jenis Olahraga Utama</th>
                                <th className="px-6 py-3">Min Harga</th>
                                <th className="px-6 py-3">Max Harga</th>
                                <th className="px-6 py-3">Foto Utama</th>
                                <th className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {existingVenues.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center px-6 py-4 text-gray-500">
                                        Tidak ada data venue ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                existingVenues.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.sport_type || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            Rp {parseInt(item.min_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            Rp {parseInt(item.max_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="Venue" className="h-10 w-16 object-cover rounded shadow" />
                                            ) : (
                                                <div className="h-10 w-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">No Image</div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-sm font-medium whitespace-nowrap"> {/* Tambahkan whitespace-nowrap */}
                                            <button
                                                onClick={() => setEditingId(item.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition duration-200 mr-2" // Tambahkan margin kanan
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

export default AdminVenuePage;