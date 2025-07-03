// src/pages/Admin/AdminGalleryPage.jsx
import React, { useState, useEffect } from 'react';

function AdminGalleryPage() {
    const [highlightName, setHighlightName] = useState('');
    const [file, setFile] = useState(null);
    const [existingGallery, setExistingGallery] = useState([
        // Data dummy untuk galeri yang sudah ada
        { id: 1, name: 'Soccer Field A', photoUrl: 'https://placehold.co/60x40/FF0000/FFFFFF?text=Gal1' },
        { id: 2, name: 'Badminton Court 1', photoUrl: 'https://placehold.co/60x40/00FF00/FFFFFF?text=Gal2' },
        { id: 3, name: 'Futsal Court 2', photoUrl: 'https://placehold.co/60x40/0000FF/FFFFFF?text=Gal3' },
        { id: 4, name: 'Basketball Court 3', photoUrl: 'https://placehold.co/60x40/FFFF00/000000?text=Gal4' },
    ]);
    const [editingId, setEditingId] = useState(null); // Untuk melacak item yang sedang diedit

    // Mengisi form jika sedang dalam mode edit
    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingGallery.find(item => item.id === editingId);
            if (itemToEdit) {
                setHighlightName(itemToEdit.name);
                setFile(null); // File tidak bisa diisi otomatis dari URL
            }
        } else {
            // Reset form saat tidak ada yang diedit
            setHighlightName('');
            setFile(null);
        }
    }, [editingId, existingGallery]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClearForm = () => {
        setHighlightName('');
        setFile(null);
        setEditingId(null); // Keluar dari mode edit
    };

    const handleAddOrUpdateGallery = (e) => {
        e.preventDefault();
        if (!highlightName || !file) {
            alert('Mohon lengkapi Nama Highlight dan Upload Foto!');
            return;
        }

        const newGalleryItem = {
            id: editingId || existingGallery.length + 1, // ID baru atau ID yang diedit
            name: highlightName,
            photoUrl: URL.createObjectURL(file), // URL untuk preview lokal
        };

        if (editingId) {
            // Update item yang sudah ada
            setExistingGallery(existingGallery.map(item =>
                item.id === editingId ? newGalleryItem : item
            ));
            alert('Data Galeri berhasil diperbarui!');
        } else {
            // Tambah item baru
            setExistingGallery([...existingGallery, newGalleryItem]);
            alert('Data Galeri berhasil ditambahkan!');
        }

        handleClearForm(); // Reset form setelah submit
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) {
            setExistingGallery(existingGallery.filter(item => item.id !== id));
            alert('Item galeri berhasil dihapus!');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gallery Management</h1>

            {/* Form Add/Edit Gallery */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
                <form onSubmit={handleAddOrUpdateGallery} className="space-y-4">
                    <div>
                        <label htmlFor="highlightName" className="block text-gray-700 text-sm font-bold mb-2">Highlight Name</label>
                        <input
                            type="text"
                            id="highlightName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. Soccer Field 1"
                            value={highlightName}
                            onChange={(e) => setHighlightName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="uploadGalleryPhoto" className="block text-gray-700 text-sm font-bold mb-2">Upload Gallery Photo</label>
                        <input
                            type="file"
                            id="uploadGalleryPhoto"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            accept="image/*"
                            required={!editingId} // Wajib jika menambah baru
                        />
                        {file && <p className="text-sm text-gray-600 mt-2">Selected file: {file.name}</p>}
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
                            {editingId ? 'Update Gallery' : 'Add Gallery'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Gallery Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Gallery</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Highlight Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Photo
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {existingGallery.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No gallery items found.
                                    </td>
                                </tr>
                            ) : (
                                existingGallery.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.photoUrl && (
                                                <img src={item.photoUrl} alt="Gallery Item" className="w-16 h-10 object-cover rounded-md" />
                                            )}
                                        </td>
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

export default AdminGalleryPage;