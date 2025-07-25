// VENUEKU-FE/src/pages/Admin/AdminPartnerManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminPartnerManagementPage() {
    const { user, isLoggedIn, isSuperadmin, manageUsers, addUser, updateUser, deleteUser } = useAuth();
    const navigate = useNavigate();

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formVenueName, setFormVenueName] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalPartners, setTotalPartners] = useState(0);
    const [perPage] = useState(10); // Number of items per page

    const fetchPartners = useCallback(async (page = 1) => {
        if (!isLoggedIn || !isSuperadmin) {
            setFetchError("Akses ditolak. Hanya Superadmin yang dapat mengelola Pengelola Venue.");
            setLoading(false);
            if (isLoggedIn) navigate('/admin/dashboard');
            else navigate('/login/admin');
            return;
        }

        setLoading(true);
        setFetchError(null);
        try {
            // Assuming manageUsers handles pagination parameters
            const response = await manageUsers('admin', page, perPage);

            setPartners(response.data);
            setLastPage(response.last_page);
            setCurrentPage(response.current_page);
            setTotalPartners(response.total);
            setFormErrors({}); // Clear form errors on successful fetch
        } catch (err) {
            console.error("Gagal mengambil daftar partner:", err.response?.data || err.message);
            setFetchError(err.response?.data?.message || "Gagal memuat daftar Pengelola Venue.");
        } finally {
                setLoading(false);
        }
    }, [isLoggedIn, isSuperadmin, manageUsers, navigate, perPage]);

    // Fetch partners on component mount and when currentPage changes
    useEffect(() => {
        fetchPartners(currentPage);
    }, [fetchPartners, currentPage]);

    // Populate form when editingUserId changes
    useEffect(() => {
        if (editingUserId !== null) {
            const partnerToEdit = partners.find(p => p.id === editingUserId);
            if (partnerToEdit) {
                setFormName(partnerToEdit.name || '');
                setFormEmail(partnerToEdit.email || '');
                setFormPassword(''); // Password is not pre-filled for security
                setFormVenueName(''); // Venue name is only for new additions
                setFormErrors({});
            }
        } else {
            clearForm();
        }
    }, [editingUserId, partners]);

    const clearForm = () => {
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormVenueName('');
        setEditingUserId(null);
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({}); // Clear previous errors

        const currentErrors = {};
        if (!formName.trim()) currentErrors.name = ['Nama lengkap wajib diisi.'];
        if (!formEmail.trim()) currentErrors.email = ['Email wajib diisi.'];
        else if (!/\S+@\S+\.\S+/.test(formEmail)) currentErrors.email = ['Format email tidak valid.'];

        if (!editingUserId) { // Password and venueName are required only for new users
            if (!formPassword) currentErrors.password = ['Password wajib diisi.'];
            else if (formPassword.length < 8) currentErrors.password = ['Password harus minimal 8 karakter.'];

            if (!formVenueName.trim()) {
                currentErrors.venueName = ['Nama Venue wajib diisi untuk Pengelola Venue baru.'];
            }
        }

        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            setLoading(false);
            return;
        }

        const userData = {
            name: formName,
            email: formEmail,
            role: 'admin', // Role is fixed as 'admin' for this page
        };
        if (formPassword) {
            userData.password = formPassword;
        }
        if (formVenueName.trim() && !editingUserId) { // Add venueName only for new users
            userData.venueName = formVenueName;
        }

        try {
            if (editingUserId) {
                const dataToUpdate = { name: userData.name, email: userData.email };
                if (userData.password) {
                    dataToUpdate.password = userData.password;
                }
                await updateUser(editingUserId, dataToUpdate, 'admin');
                alert('Pengelola Venue berhasil diperbarui!');
            } else {
                await addUser(userData, 'admin');
                alert('Pengelola Venue berhasil ditambahkan!');
            }
            fetchPartners(currentPage); // Re-fetch data to show updated list
            clearForm(); // Reset form
        } catch (err) {
            console.error('Submit error:', err.response?.data || err.message);
            if (err.response?.status === 422) {
                setFormErrors(err.response.data.errors || { general: err.response.data.message || 'Validasi gagal.' });
            } else {
                setFormErrors({ general: err.message || 'Terjadi kesalahan saat menyimpan data.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (partner) => {
        setEditingUserId(partner.id);
        setFormName(partner.name || '');
        setFormEmail(partner.email || '');
        setFormPassword(''); // Clear password field for editing
        setFormVenueName(''); // Clear venue name field for editing
        setFormErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus Pengelola Venue ini?')) {
            return;
        }
        setLoading(true);
        setFormErrors({});
        try {
            await deleteUser(id, 'admin');
            alert('Pengelola Venue berhasil dihapus!');
            fetchPartners(currentPage); // Re-fetch data after deletion
        } catch (err) {
            console.error('Delete error:', err.response?.data || err.message);
            setFormErrors({ general: err.message || 'Terjadi kesalahan saat menghapus.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    // Display loading state
    if (loading && partners.length === 0 && !fetchError) {
        return <p className="text-center text-xl mt-8">Memuat daftar Pengelola Venue...</p>;
    }

    // Display fetch error
    if (fetchError) {
        return <p className="text-center text-red-600 mt-8">Error: {fetchError}</p>;
    }

    // Restrict access if not a Superadmin
    if (!isSuperadmin) {
        return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Superadmin.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengelola Venue</h1>

            {/* Form Add/Edit Partner */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingUserId ? '✏ Edit Pengelola Venue' : 'Tambah Pengelola Venue Baru'}</h2>
                {formErrors.general && <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* PERUBAHAN DI SINI: Hanya grid-cols-1 untuk form agar selalu satu kolom */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                id="name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                required
                            />
                            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                required
                                disabled={!!editingUserId}
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email[0]}</p>}
                        </div>
                    </div>
                    {/* PERUBAHAN DI SINI: Hanya grid-cols-1 untuk form agar selalu satu kolom */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password {editingUserId && '(Kosongkan jika tidak ingin mengubah)'}</label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                required={!editingUserId}
                            />
                            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password[0]}</p>}
                        </div>
                        {/* Input Nama Venue hanya muncul saat menambah baru */}
                        {!editingUserId && (
                            <div>
                                <label htmlFor="venueName" className="block text-gray-700 text-sm font-bold mb-2">Nama Venue yang Dikelola</label>
                                <input
                                    type="text"
                                    id="venueName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nama Venue A (akan dibuat otomatis)"
                                    value={formVenueName}
                                    onChange={(e) => setFormVenueName(e.target.value)}
                                    required={!editingUserId}
                                />
                                <p className="text-xs text-gray-600 mt-1">Venue baru akan dibuat otomatis dan dikaitkan dengan admin ini.</p>
                                {formErrors.venueName && <p className="text-red-500 text-sm mt-1">{formErrors.venueName[0]}</p>}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={clearForm}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            disabled={loading}
                        >
                            Bersihkan Form
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : (editingUserId ? 'Perbarui Partner' : 'Tambah Partner')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Partner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Pengelola Venue</h2>
                <div className="overflow-x-auto">
                    {/* Penambahan class table-fixed untuk layout tabel yang lebih terkontrol */}
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                    Nama
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Role
                                </th>
                                {/* Penyesuaian lebar kolom Venue Dikelola */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                                    Venue Dikelola
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {partners.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Tidak ada Pengelola Venue ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                partners.map(partner => (
                                    <tr key={partner.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{partner.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{partner.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{partner.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{partner.role}</td>
                                        {/* Menggunakan line-clamp-2 agar teks terpotong jika terlalu panjang */}
                                        <td className="px-6 py-4 text-sm text-gray-500 line-clamp-2">
                                            {partner.venue_names && partner.venue_names.length > 0
                                                ? partner.venue_names.join(', ')
                                                : 'Belum ada Venue'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(partner)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
                                                className="text-red-600 hover:text-red-900"
                                                disabled={user?.id === partner.id} // Tidak bisa menghapus diri sendiri
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Kontrol Paginasi */}
                    {lastPage > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: lastPage }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPartnerManagementPage;