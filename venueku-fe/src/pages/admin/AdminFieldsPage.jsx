import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCookie } from '../../utils/cookies';

function AdminFieldsPage() {
    const { user, isLoggedIn, fetchCsrfCookie } = useAuth();

    // States untuk data form
    const [venueId, setVenueId] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [sportType, setSportType] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [file, setFile] = useState(null);

    // States untuk data tabel
    const [existingFields, setExistingFields] = useState([]);
    const [venues, setVenues] = useState([]);

    // States untuk UI/Interaksi
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // --- Fungsi Pengambilan Data ---

    const fetchFields = async () => {
        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            setFetchError("Anda tidak memiliki akses. Silakan login sebagai Admin atau Superadmin.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/admin/fields');
            setExistingFields(response.data);
            setLoading(false);
            setFetchError(null);
        } catch (error) {
            console.error('Error fetching fields:', error.response ? error.response.data : error.message);
            let errorMessage = "Gagal memuat data lapangan. Pastikan API berjalan dan Anda terautentikasi.";
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini.";
            }
            setFetchError(errorMessage);
            setLoading(false);
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await api.get('/venues');
            setVenues(response.data);
        } catch (err) {
            console.error('Failed to load venues:', err.response ? err.response.data : err.message);
        }
    };

    // --- useEffect Hooks ---

    useEffect(() => {
        if (isLoggedIn) {
            fetchFields();
            fetchVenues();
        } else {
            setLoading(false);
            setFetchError("Silakan login untuk mengelola lapangan.");
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingFields.find(f => f.id === editingId);
            if (itemToEdit) {
                setVenueId(itemToEdit.venue_id || '');
                setFieldName(itemToEdit.name || '');
                setSportType(itemToEdit.sport_type || '');
                setPricePerHour(itemToEdit.price_per_hour.toString() || '');
                setOpeningTime(itemToEdit.opening_time.substring(0, 5) || '');
                setClosingTime(itemToEdit.closing_time.substring(0, 5) || '');
                setFile(null);
            }
        } else {
            clearForm();
        }
    }, [editingId, existingFields]);

    // --- Fungsi Penanganan Form ---

    const clearForm = () => {
        setVenueId('');
        setFieldName('');
        setSportType('');
        setPricePerHour('');
        setOpeningTime('');
        setClosingTime('');
        setFile(null);
        setEditingId(null);
        setErrors({});
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddOrUpdateField = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!venueId || !fieldName || !sportType || !pricePerHour || !openingTime || !closingTime) {
            alert('Semua field wajib diisi.');
            return;
        }

        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            alert('Anda tidak memiliki izin untuk melakukan operasi ini.');
            return;
        }

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
        formData.append('name', fieldName);
        formData.append('sport_type', sportType);
        formData.append('price_per_hour', pricePerHour);
        formData.append('opening_time', openingTime + ':00');
        formData.append('closing_time', closingTime + ':00');

        if (file) {
            formData.append('photo_url', file);
        } else if (editingId) {
            const currentField = existingFields.find(item => item.id === editingId);
            if (currentField && currentField.photo_url) {
                // If editing and no new file, keep the existing photo_url
                // Note: For PUT requests with FormData, if photo_url is not sent, it usually means no change.
                // If the backend expects it explicitly, you might need to handle it based on your API.
                // For a typical RESTful PUT, omitting a field means no change unless specified.
                // If your backend needs it explicitly, uncomment the line below.
                // formData.append('photo_url', currentField.photo_url);
            }
        }

        try {
            if (editingId) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/fields/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Field berhasil diperbarui!');
            } else {
                await api.post('/admin/fields', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                });
                alert('Field berhasil ditambahkan!');
            }
            fetchFields();
            clearForm();
        } catch (error) {
            console.error('Save error:', error.response ? error.response.data : error.message);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                alert('Validasi gagal. Mohon periksa input Anda.');
            } else {
                alert('Terjadi kesalahan saat menyimpan data lapangan: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this field?')) {
            return;
        }

        if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
            alert('Anda tidak memiliki izin untuk melakukan operasi ini.');
            return;
        }

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
            await api.delete(`/admin/fields/${id}`, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            alert('Field berhasil dihapus!');
            fetchFields();
        } catch (error) {
            console.error('Delete error:', error.response ? error.response.data : error.message);
            alert('Terjadi kesalahan saat menghapus field: ' + (error.response?.data?.message || error.message));
        }
    };

    // --- Render Komponen ---

    if (loading) {
        return <div className="text-center py-8 text-gray-700">Memuat data lapangan...</div>;
    }

    if (fetchError) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan: {fetchError}</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8"> {/* Adjusted padding for responsiveness */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Lapangan</h1>

            ---

            {/* Form Tambah/Edit Field */}
            <form onSubmit={handleAddOrUpdateField} className="bg-white p-6 rounded-lg shadow space-y-6 mb-10">
                <h2 className="text-xl font-semibold text-gray-800">{editingId ? '✏ Edit Lapangan' : 'Tambah Lapangan Baru'}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Venue */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Venue</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={venueId}
                            onChange={e => setVenueId(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Venue --</option>
                            {venues.map(venue => (
                                <option key={venue.id} value={venue.id}>{venue.name}</option>
                            ))}
                        </select>
                        {errors.venue_id && <p className="text-red-500 text-sm mt-1">{errors.venue_id[0]}</p>}
                    </div>

                    {/* Input Nama Lapangan */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Nama Lapangan</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={fieldName}
                            onChange={e => setFieldName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                    </div>

                    {/* Input Jenis Olahraga */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Jenis Olahraga</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={sportType}
                            onChange={e => setSportType(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Olahraga --</option>
                            <option value="Soccer">Sepak Bola</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Badminton">Bulu Tangkis</option>
                            <option value="Basketball">Bola Basket</option>
                            <option value="Tenis">Tenis</option>
                            <option value="Voli">Voli</option>
                            <option value="Renang">Renang</option>
                        </select>
                        {errors.sport_type && <p className="text-red-500 text-sm mt-1">{errors.sport_type[0]}</p>}
                    </div>

                    {/* Input Harga per Jam */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Harga per Jam (IDR)</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={pricePerHour}
                            onChange={e => setPricePerHour(e.target.value)}
                            required
                        />
                        {errors.price_per_hour && <p className="text-red-500 text-sm mt-1">{errors.price_per_hour[0]}</p>}
                    </div>

                    {/* Input Jam Buka */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Jam Buka</label>
                        <input
                            type="time"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={openingTime}
                            onChange={e => setOpeningTime(e.target.value)}
                            required
                        />
                        {errors.opening_time && <p className="text-red-500 text-sm mt-1">{errors.opening_time[0]}</p>}
                    </div>

                    {/* Input Jam Tutup */}
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Jam Tutup</label>
                        <input
                            type="time"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={closingTime}
                            onChange={e => setClosingTime(e.target.value)}
                            required
                        />
                        {errors.closing_time && <p className="text-red-500 text-sm mt-1">{errors.closing_time[0]}</p>}
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-2 text-gray-700">Foto Lapangan</label>
                    <input
                        type="file"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {file && <p className="text-sm text-gray-600 mt-2">File terpilih: {file.name}</p>}
                    {editingId && existingFields.find(item => item.id === editingId)?.photo_url && !file && (
                        <p className="text-sm text-gray-600 mt-2">
                            Foto yang sudah ada: <a href={existingFields.find(item => item.id === editingId).photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Foto</a>
                        </p>
                    )}
                    {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo[0]}</p>}
                    {errors.photo_url && <p className="text-red-500 text-sm mt-1">{errors.photo_url[0]}</p>}
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3">
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
                        {editingId ? 'Perbarui Lapangan' : 'Tambah Lapangan'}
                    </button>
                </div>
            </form>

            ---

            {/* Tabel Daftar Lapangan */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto"> {/* Added for horizontal scrolling on smaller screens */}
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100 text-left font-semibold text-gray-600">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Olahraga</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Operasional</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {existingFields.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">Tidak ada lapangan ditemukan.</td> {/* Colspan adjusted to 7 */}
                                </tr>
                            ) : (
                                existingFields.map(field => (
                                    <tr key={field.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-800">
                                            {venues.find(v => v.id === field.venue_id)?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 font-medium text-gray-900">{field.name}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-800">{field.sport_type}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-800">
                                            Rp {parseInt(field.price_per_hour).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-800">
                                            {field.opening_time?.substring(0, 5)} - {field.closing_time?.substring(0, 5)}
                                        </td>
                                        <td className="px-6 py-3">
                                            {field.photo_url ? (
                                                <img src={field.photo_url} alt={`Foto ${field.name}`} className="h-10 w-16 object-cover rounded shadow" />
                                            ) : (
                                                <div className="h-10 w-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">No Image</div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-sm font-medium">
                                            <button
                                                onClick={() => setEditingId(field.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(field.id)}
                                                className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition duration-200 ml-2" // Added ml-2 for spacing
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

export default AdminFieldsPage;