// src/pages/Admin/AdminFieldsPage.jsx
import React, { useState, useEffect } from 'react';

function AdminFieldsPage() {
    const [fieldName, setFieldName] = useState('');
    const [sportType, setSportType] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [operatingHours, setOperatingHours] = useState('');
    const [supportingFacilities, setSupportingFacilities] = useState('');
    const [file, setFile] = useState(null);
    const [existingFields, setExistingFields] = useState([
        // Data dummy untuk lapangan yang sudah ada
        { id: 1, name: 'Soccer Field A', sport: 'Soccer', price: 150000, hours: '08:00-22:00', photoUrl: 'https://placehold.co/60x40/FF0000/FFFFFF?text=Photo1' },
        { id: 2, name: 'Badminton Court 1', sport: 'Badminton', price: 80000, hours: '09:00-21:00', photoUrl: 'https://placehold.co/60x40/00FF00/FFFFFF?text=Photo2' },
        { id: 3, name: 'Futsal Court 2', sport: 'Futsal', price: 120000, hours: '07:00-23:00', photoUrl: 'https://placehold.co/60x40/0000FF/FFFFFF?text=Photo3' },
        { id: 4, name: 'Basketball Court 3', sport: 'Basketball', price: 100000, hours: '10:00-20:00', photoUrl: 'https://placehold.co/60x40/FFFF00/000000?text=Photo4' },
    ]);
    const [editingId, setEditingId] = useState(null); // Untuk melacak item yang sedang diedit

    // Mengisi form jika sedang dalam mode edit
    useEffect(() => {
        if (editingId !== null) {
            const itemToEdit = existingFields.find(item => item.id === editingId);
            if (itemToEdit) {
                setFieldName(itemToEdit.name);
                setSportType(itemToEdit.sport);
                setPricePerHour(itemToEdit.price);
                setOperatingHours(itemToEdit.hours);
                // Asumsi fasilitas dan foto tidak ada di data dummy awal, atau perlu field baru di dummy
                setSupportingFacilities(''); // Kosongkan atau ambil dari data jika ada
                setFile(null); // File tidak bisa diisi otomatis dari URL
            }
        } else {
            // Reset form saat tidak ada yang diedit
            setFieldName('');
            setSportType('');
            setPricePerHour('');
            setOperatingHours('');
            setSupportingFacilities('');
            setFile(null);
        }
    }, [editingId, existingFields]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleClearForm = () => {
        setFieldName('');
        setSportType('');
        setPricePerHour('');
        setOperatingHours('');
        setSupportingFacilities('');
        setFile(null);
        setEditingId(null); // Keluar dari mode edit
    };

    const handleAddOrUpdateField = (e) => {
        e.preventDefault();
        if (!fieldName || !sportType || !pricePerHour || !operatingHours) {
            alert('Mohon lengkapi field Nama Lapangan, Jenis Olahraga, Harga, dan Jam Operasional!');
            return;
        }

        const newField = {
            id: editingId || existingFields.length + 1, // ID baru atau ID yang diedit
            name: fieldName,
            sport: sportType,
            price: parseFloat(pricePerHour), // Konversi ke angka
            hours: operatingHours,
            photoUrl: file ? URL.createObjectURL(file) : 'https://placehold.co/60x40/CCCCCC/000000?text=NoPhoto', // URL foto dummy/preview
            // Fasilitas pendukung bisa ditambahkan jika ada field di data dummy
        };

        if (editingId) {
            // Update item yang sudah ada
            setExistingFields(existingFields.map(item =>
                item.id === editingId ? newField : item
            ));
            alert('Data Lapangan berhasil diperbarui!');
        } else {
            // Tambah item baru
            setExistingFields([...existingFields, newField]);
            alert('Data Lapangan berhasil ditambahkan!');
        }

        handleClearForm(); // Reset form setelah submit
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
            setExistingFields(existingFields.filter(item => item.id !== id));
            alert('Lapangan berhasil dihapus!');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Field Management</h1>

            {/* Form Add/Edit Field */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? 'Edit Field' : 'Add New Field'}</h2>
                <form onSubmit={handleAddOrUpdateField} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fieldName" className="block text-gray-700 text-sm font-bold mb-2">Field Name</label>
                            <input
                                type="text"
                                id="fieldName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="e.g. Soccer Field 1"
                                value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="sportType" className="block text-gray-700 text-sm font-bold mb-2">Sport Type</label>
                            <select
                                id="sportType"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={sportType}
                                onChange={(e) => setSportType(e.target.value)}
                                required
                            >
                                <option value="">Select Sport</option>
                                <option value="Soccer">Soccer</option>
                                <option value="Futsal">Futsal</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Tenis">Tenis</option>
                                <option value="Voli">Voli</option>
                                <option value="Renang">Renang</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="pricePerHour" className="block text-gray-700 text-sm font-bold mb-2">Price per Hour (IDR)</label>
                            <input
                                type="number" // Gunakan type number untuk harga
                                id="pricePerHour"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="e.g. 150000"
                                value={pricePerHour}
                                onChange={(e) => setPricePerHour(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="operatingHours" className="block text-gray-700 text-sm font-bold mb-2">Operating Hours</label>
                            <input
                                type="text"
                                id="operatingHours"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="e.g. 08:00 - 22:00"
                                value={operatingHours}
                                onChange={(e) => setOperatingHours(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="supportingFacilities" className="block text-gray-700 text-sm font-bold mb-2">Supporting Facilities</label>
                        <input
                            type="text"
                            id="supportingFacilities"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="e.g. Changing room, Parking, Cafe"
                            value={supportingFacilities}
                            onChange={(e) => setSupportingFacilities(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="uploadFieldPhoto" className="block text-gray-700 text-sm font-bold mb-2">Upload Field Photo</label>
                        <input
                            type="file"
                            id="uploadFieldPhoto"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            accept="image/*"
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
                            {editingId ? 'Update Field' : 'Add Field'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Fields Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Fields</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sport
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hours
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
                            {existingFields.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No fields found.
                                    </td>
                                </tr>
                            ) : (
                                existingFields.map(field => (
                                    <tr key={field.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{field.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.sport}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {field.price.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.hours}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {field.photoUrl && (
                                                <img src={field.photoUrl} alt="Field" className="w-16 h-10 object-cover rounded-md" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(field.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(field.id)}
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

export default AdminFieldsPage;