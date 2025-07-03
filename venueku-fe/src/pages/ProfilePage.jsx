// src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

function ProfilePage() {
    const { username, userRole } = useContext(AuthContext); // Dapatkan username dan role dari Context

    // Dummy data profil (akan diganti dengan data dari backend)
    const [profileData, setProfileData] = useState({
        fullName: username || 'Pengguna VenueKu',
        email: userRole === 'admin' ? 'admin@example.com' : 'user@example.com',
        birthDate: '2000-01-01',
        gender: 'Laki-laki',
        phoneNumber: '081234567890',
        location: 'Jakarta',
    });

    const [profilePicture, setProfilePicture] = useState(null); // Untuk file gambar
    const [profilePictureUrl, setProfilePictureUrl] = useState('https://via.placeholder.com/150/ADD8E6/FFFFFF?text=AVATAR'); // URL gambar profil

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setProfilePictureUrl(URL.createObjectURL(file)); // Tampilkan preview gambar
        }
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Logika untuk mengirim data profil yang diperbarui ke backend
        console.log('Profile data updated:', profileData);
        console.log('New profile picture:', profilePicture);
        alert('Profil berhasil diperbarui! (Simulasi)');
        // Di sini Anda akan mengirim data ke API backend
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
            <p className="text-gray-600 mb-8">Lengkapi profil Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Kolom Kiri: Update Profile Picture */}
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-blue-500">
                        <img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        {/* Placeholder untuk ikon kamera/edit */}
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{profileData.fullName}</h2>
                    <p className="text-gray-600 text-sm mb-4">{profileData.email}</p>

                    <div className="w-full mb-4">
                        <label htmlFor="profilePictureInput" className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md cursor-pointer hover:bg-gray-300 text-center">
                            Pilih Foto Profil
                        </label>
                        <input
                            type="file"
                            id="profilePictureInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500 mt-2">Drag & drop foto di sini atau klik untuk upload.</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-sm">Update Profile</button>
                </div>

                {/* Kolom Kanan: Profile Details Form */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Profil</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
                                    value={profileData.email}
                                    disabled // Email biasanya tidak bisa diedit
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.birthDate}
                                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                                <select
                                    id="gender"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.gender}
                                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                >
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.phoneNumber}
                                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Lokasi</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 focus:outline-none focus:shadow-outline mt-6"
                        >
                            SIMPAN PROFIL
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;