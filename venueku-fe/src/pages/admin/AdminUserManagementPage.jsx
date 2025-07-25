// VENUEKU-FE/src/pages/Admin/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminUserManagementPage() {
    const { manageUsers, addUser, updateUser, deleteUser, userRole, authUser } = useAuth(); // Ambil authUser untuk cek ID
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Loading untuk fetch data tabel
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading untuk submit form (add/edit)
    const [fetchError, setFetchError] = useState(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [perPage] = useState(10); // Sesuaikan dengan per_page di UserController@index

    // Menggunakan useCallback untuk fetchUsers agar tidak dibuat ulang setiap render
    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        setFetchError(null);

        if (userRole !== 'superadmin') {
            setLoading(false);
            setFetchError('Akses ditolak. Halaman ini hanya untuk Superadmin.');
            navigate('/admin/dashboard');
            return;
        }

        try {
            const response = await manageUsers('user', page, perPage);
            // Pastikan response.data adalah array users, jika tidak, cek struktur respons API Anda
            setUsers(response.data);
            setLastPage(response.last_page);
            setCurrentPage(response.current_page);
            setTotalUsers(response.total);
            setFormErrors({}); // Bersihkan error form saat refresh data
        } catch (err) {
            console.error("Gagal mengambil daftar pengguna:", err.response?.data || err.message);
            setFetchError(err.response?.data?.message || "Gagal mengambil daftar pengguna.");
        } finally {
            setLoading(false);
        }
    }, [userRole, manageUsers, perPage, navigate]);

    // Effect untuk mengambil data saat komponen dimuat atau halaman berubah
    useEffect(() => {
        fetchUsers(currentPage);
    }, [fetchUsers, currentPage]);

    // Effect untuk mengisi form saat mode edit diaktifkan
    useEffect(() => {
        if (editingUserId !== null) {
            const userToEdit = users.find(u => u.id === editingUserId);
            if (userToEdit) {
                setFormName(userToEdit.name || '');
                setFormEmail(userToEdit.email || '');
                setFormPassword(''); // Password sengaja dikosongkan untuk keamanan
                setFormErrors({});
            } else {
                // Jika userToEdit tidak ditemukan (misal: user ada di halaman lain),
                // bisa ditambahkan logika untuk fetch user tersebut secara individual
                // atau cukup bersihkan form. Untuk saat ini, kita bersihkan form.
                console.warn("Pengguna dengan ID", editingUserId, "tidak ditemukan di daftar saat ini. Membersihkan form.");
                handleClearForm();
            }
        } else {
            handleClearForm(); // Bersihkan form saat tidak ada yang diedit
        }
    }, [editingUserId, users]); // Tambahkan `users` sebagai dependensi karena `find` bergantung padanya

    // Menggunakan useCallback untuk handleClearForm
    const handleClearForm = useCallback(() => {
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setEditingUserId(null);
        setFormErrors({});
    }, []); // Tidak ada dependensi karena hanya mereset state

    // Fungsi untuk menambah atau memperbarui user
    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Set loading untuk submit form
        setFormErrors({}); // Reset error form

        // Validasi frontend yang lebih robust
        const currentErrors = {};
        if (!formName.trim()) currentErrors.name = ['Nama lengkap wajib diisi.'];
        if (!formEmail.trim()) currentErrors.email = ['Email wajib diisi.'];
        else if (!/\S+@\S+\.\S+/.test(formEmail)) currentErrors.email = ['Format email tidak valid.'];
        
        if (!editingUserId) { // Password wajib hanya untuk user baru
            if (!formPassword) currentErrors.password = ['Password wajib diisi.'];
            else if (formPassword.length < 8) currentErrors.password = ['Password harus minimal 8 karakter.'];
        }

        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            setIsSubmitting(false);
            return;
        }

        const userData = { name: formName, email: formEmail };
        if (formPassword) { // Password hanya disertakan jika ada (untuk menambah user baru atau mengubah password)
            userData.password = formPassword;
        }

        try {
            if (editingUserId) {
                const dataToUpdate = { name: userData.name, email: userData.email };
                if (userData.password) { // Tambahkan password jika diisi
                    dataToUpdate.password = userData.password;
                }
                await updateUser(editingUserId, dataToUpdate, 'user');
                alert('Pengguna berhasil diperbarui!');
            } else {
                await addUser(userData, 'user');
                alert('Pengguna berhasil ditambahkan!');
            }
            fetchUsers(currentPage); // Refresh daftar user setelah operasi
            handleClearForm(); // Bersihkan form
        } catch (err) {
            console.error("Error menambah/mengedit pengguna:", err.response?.data || err.message);
            // Tangani error validasi dari backend
            if (err.response?.status === 422) {
                setFormErrors(err.response.data.errors || { general: err.response.data.message || 'Validasi gagal.' });
            } else {
                setFormErrors({ general: err.message || 'Terjadi kesalahan saat menyimpan data.' });
            }
        } finally {
            setIsSubmitting(false); // Selesai submit form
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setFormName(user.name || '');
        setFormEmail(user.email || '');
        setFormPassword('');
        setFormErrors({});
    };

    const handleDelete = async (id, userName) => { // Tambahkan userName untuk konfirmasi
        if (!window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}" ini?`)) {
            return;
        }
        setLoading(true); // Set loading untuk aksi tabel
        setFormErrors({});
        try {
            await deleteUser(id, 'user');
            alert('Pengguna berhasil dihapus!');
            fetchUsers(currentPage); // Refresh daftar user setelah penghapusan
        } catch (err) {
            console.error("Error menghapus pengguna:", err.response?.data || err.message);
            setFormErrors({ general: err.message || 'Terjadi kesalahan saat menghapus.' });
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    // Kondisi loading, error, atau akses ditolak
    if (loading && users.length === 0 && !fetchError) {
        return <p className="text-center text-xl mt-8">Memuat daftar pengguna...</p>;
    }

    if (fetchError) {
        return <p className="text-center text-red-600 mt-8">Error: {fetchError}</p>;
    }

    if (userRole !== 'superadmin') {
        return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Superadmin.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengguna</h1>

            {/* Form Add/Edit User */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingUserId ? '✏ Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                {formErrors.general && <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>}
                <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            id="userName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                            disabled={isSubmitting} // Nonaktifkan saat submit
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="userEmail"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            required
                            disabled={!!editingUserId || isSubmitting} // Nonaktifkan saat edit dan submit
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email[0]}</p>}
                    </div>
                    <div> {/* Field password selalu ada, tapi required hanya untuk new user */}
                        <label htmlFor="userPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Password {editingUserId && '(Kosongkan jika tidak ingin mengubah)'}
                        </label>
                        <input
                            type="password"
                            id="userPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            required={!editingUserId} // Required hanya jika bukan mode edit
                            disabled={isSubmitting} // Nonaktifkan saat submit
                        />
                        {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password[0]}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClearForm}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            disabled={isSubmitting} // Nonaktifkan saat submit
                        >
                            Bersihkan Form
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            disabled={isSubmitting} // Nonaktifkan saat submit
                        >
                            {isSubmitting ? 'Memproses...' : (editingUserId ? 'Perbarui Pengguna' : 'Tambah Pengguna')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Daftar Pengguna */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Pengguna</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Tidak ada pengguna ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                disabled={loading || isSubmitting} // Nonaktifkan saat loading atau submit
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)} // Kirim nama user
                                                className="text-red-600 hover:text-red-900"
                                                disabled={loading || isSubmitting || (authUser && authUser.id === user.id)} // Tidak bisa menghapus diri sendiri
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
            {/* Kontrol Paginasi */}
            {lastPage > 1 && (
                <div className="flex justify-between items-center space-x-2 mt-4">
                    <div className="text-sm text-gray-600">
                        Menampilkan {totalUsers === 0 ? 0 : (currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, totalUsers)} dari {totalUsers} pengguna
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading || isSubmitting}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: lastPage }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                disabled={loading || isSubmitting}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage || loading || isSubmitting}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUserManagementPage;