// src/pages/Admin/AdminPartnerManagementPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function AdminPartnerManagementPage() {
    const { manageUsers, addUser, updateUser, deleteUser, userRole } = useContext(AuthContext);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formVenueName, setFormVenueName] = useState(''); // Field khusus partner
    const [editingPartnerId, setEditingPartnerId] = useState(null);

    const fetchPartners = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedPartners = await manageUsers('admin'); // Mengelola partner (role 'admin')
            setPartners(fetchedPartners);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole === 'superadmin') {
            fetchPartners();
        } else {
            setLoading(false);
            setError('Akses ditolak. Hanya Superadmin yang bisa melihat halaman ini.');
        }
    }, [userRole]);

    const handleClearForm = () => {
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormVenueName('');
        setEditingPartnerId(null);
    };

    const handleAddOrUpdatePartner = async (e) => {
        e.preventDefault();
        if (!formName || !formEmail || (!editingPartnerId && !formPassword) || !formVenueName) {
            alert('Mohon lengkapi semua field yang wajib.');
            return;
        }

        const partnerData = { name: formName, email: formEmail, venueName: formVenueName };
        if (formPassword) {
            partnerData.password = formPassword;
        }

        try {
            if (editingPartnerId) {
                await updateUser(editingPartnerId, partnerData, 'admin');
            } else {
                await register(formEmail, formPassword, formName, 'admin'); // Memanggil register dari AuthContext
                alert('Partner berhasil ditambahkan dan terdaftar!');
            }
            fetchPartners(); // Refresh daftar partner
            handleClearForm();
        } catch (err) {
            alert(`Gagal: ${err.message}`);
        }
    };

    const handleEdit = (partner) => {
        setEditingPartnerId(partner.id);
        setFormName(partner.name);
        setFormEmail(partner.email);
        setFormVenueName(partner.venueName || ''); // Pastikan ada fallback
        setFormPassword('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus partner ini?')) {
            try {
                await deleteUser(id, 'admin');
                fetchPartners();
                alert('Partner berhasil dihapus!');
            } catch (err) {
                alert(`Gagal menghapus: ${err.message}`);
            }
        }
    };

    if (loading) return <p className="text-center text-xl mt-8">Memuat daftar partner...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
    if (userRole !== 'superadmin') return <p className="text-center text-red-500 mt-8">Akses Ditolak. Halaman ini hanya untuk Superadmin.</p>;


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Partner Management</h1>

            {/* Form Add/Edit Partner */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingPartnerId ? 'Edit Partner' : 'Add New Partner'}</h2>
                <form onSubmit={handleAddOrUpdatePartner} className="space-y-4">
                    <div>
                        <label htmlFor="partnerName" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="partnerName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="partnerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="partnerEmail"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            required
                            disabled={!!editingPartnerId}
                        />
                    </div>
                    {!editingPartnerId && (
                        <div>
                            <label htmlFor="partnerPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="partnerPassword"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                required={!editingPartnerId}
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="venueName" className="block text-gray-700 text-sm font-bold mb-2">Venue Name</label>
                        <input
                            type="text"
                            id="venueName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formVenueName}
                            onChange={(e) => setFormVenueName(e.target.value)}
                            required
                        />
                    </div>
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
                            {editingPartnerId ? 'Update Partner' : 'Add Partner'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Partners Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Partners</h2>
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
                                    Venue Name
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
                            {partners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No partners found.
                                    </td>
                                </tr>
                            ) : (
                                partners.map(partner => (
                                    <tr key={partner.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{partner.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.venueName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(partner)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(partner.id)}
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

export default AdminPartnerManagementPage;