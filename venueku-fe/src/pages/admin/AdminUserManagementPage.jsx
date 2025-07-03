// src/pages/Admin/AdminUserManagementPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function AdminUserManagementPage() {
    const { manageUsers, addUser, updateUser, deleteUser, userRole } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedUsers = await manageUsers('user'); // Mengelola user biasa
            setUsers(fetchedUsers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole === 'superadmin') {
            fetchUsers();
        } else {
            setLoading(false);
            setError('Akses ditolak. Hanya Superadmin yang bisa melihat halaman ini.');
        }
    }, [userRole]); // Re-fetch saat userRole berubah

    const handleClearForm = () => {
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setEditingUserId(null);
    };

    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        if (!formName || !formEmail || (!editingUserId && !formPassword)) {
            alert('Mohon lengkapi semua field yang wajib.');
            return;
        }

        const userData = { name: formName, email: formEmail };
        if (formPassword) { // Hanya tambahkan password jika ada (untuk register/ubah password)
            userData.password = formPassword;
        }

        try {
            if (editingUserId) {
                await updateUser(editingUserId, userData, 'user');
            } else {
                // Untuk menambah user baru, kita perlu ID unik.
                // Dalam simulasi ini, kita akan menggunakan email sebagai ID sementara atau generate UUID.
                // Dalam Firebase Auth, user.uid akan menjadi ID.
                // Untuk demo ini, kita akan menggunakan email sebagai ID untuk Firestore document,
                // dan mengandalkan AuthContext.register untuk membuat user di Firebase Auth.
                await register(formEmail, formPassword, formName, 'user'); // Memanggil register dari AuthContext
                alert('User berhasil ditambahkan dan terdaftar!');
            }
            fetchUsers(); // Refresh daftar user
            handleClearForm();
        } catch (err) {
            alert(`Gagal: ${err.message}`);
        }
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormPassword(''); // Password tidak bisa diisi otomatis untuk edit
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await deleteUser(id, 'user');
                fetchUsers();
                alert('User berhasil dihapus!');
            } catch (err) {
                alert(`Gagal menghapus: ${err.message}`);
            }
        }
    };

    if (loading) return <p className="text-center text-xl mt-8">Memuat daftar user...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
    if (userRole !== 'superadmin') return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Superadmin.</p>;


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

            {/* Form Add/Edit User */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingUserId ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="userName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                        />
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
                            disabled={!!editingUserId} // Email tidak bisa diedit
                        />
                    </div>
                    {!editingUserId && ( // Password hanya wajib saat menambah baru
                        <div>
                            <label htmlFor="userPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="userPassword"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                required={!editingUserId}
                            />
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClearForm}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {editingUserId ? 'Update User' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Users Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
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

export default AdminUserManagementPage;