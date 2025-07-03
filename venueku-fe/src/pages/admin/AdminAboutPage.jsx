// src/pages/Admin/AdminAboutPage.jsx
import React, { useState, useEffect } from 'react';

function AdminAboutPage() {
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [facilities, setFacilities] = useState('');
    const [file, setFile] = useState(null);
    const [existingAbout, setExistingAbout] = useState([
        // Data dummy untuk About yang sudah ada
        { id: 1, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', address: 'Jl. Contoh No. 1, Jakarta', facilities: 'Shower, Parking, Cafe' },
        { id: 2, description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.', address: 'Jl. Dummy No. 2, Bandung', facilities: 'Locker, Mushola' },
    ]);
    const [editingId, setEditingId] = useState(null); // Untuk melacak item yang sedang diedit

    // Mengisi form jika sedang dalam mode edit
    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingAbout.find(item => item.id === editingId);
            if (itemToEdit) {
                setDescription(itemToEdit.description);
                setAddress(itemToEdit.address);
                setFacilities(itemToEdit.facilities);
                // File tidak bisa diisi otomatis dari URL, jadi biarkan null
            }
        } else {
            // Reset form saat tidak ada yang diedit
            setDescription('');
            setAddress('');
            setFacilities('');
            setFile(null);
        }
    }, [editingId, existingAbout]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClearForm = () => {
        setDescription('');
        setAddress('');
        setFacilities('');
        setFile(null);
        setEditingId(null); // Keluar dari mode edit
    };

    const handleAddOrUpdateAbout = (e) => {
        e.preventDefault();
        if (!description || !address || !facilities) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        const newAbout = {
            id: editingId || existingAbout.length + 1, // ID baru atau ID yang diedit
            description,
            address,
            facilities,
            // File tidak disimpan di sini, hanya simulasi upload
        };

        if (editingId) {
            // Update item yang sudah ada
            setExistingAbout(existingAbout.map(item =>
                item.id === editingId ? newAbout : item
            ));
            alert('Data About berhasil diperbarui!');
        } else {
            // Tambah item baru
            setExistingAbout([...existingAbout, newAbout]);
            alert('Data About berhasil ditambahkan!');
        }

        handleClearForm(); // Reset form setelah submit
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            setExistingAbout(existingAbout.filter(item => item.id !== id));
            alert('Data About berhasil dihapus!');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">About Management</h1>

            {/* Form Add/Edit About */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? 'Edit About' : 'Add New About'}</h2>
                <form onSubmit={handleAddOrUpdateAbout} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            id="description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                            placeholder="e.g. Soccer Field 1"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. Changing room, Parking, Cafe"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="facilities" className="block text-gray-700 text-sm font-bold mb-2">Facilities</label>
                        <input
                            type="text"
                            id="facilities"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. Changing room, Parking, Cafe"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
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
                            {editingId ? 'Update About' : 'Add About'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing About Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing About</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Facilities
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {existingAbout.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No "About" data found.
                                    </td>
                                </tr>
                            ) : (
                                existingAbout.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">{item.description}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">{item.address}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">{item.facilities}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

export default AdminAboutPage;