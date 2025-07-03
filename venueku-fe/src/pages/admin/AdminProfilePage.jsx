// src/pages/Admin/AdminProfilePage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

function AdminProfilePage() {
    const { username, userRole, logout } = useContext(AuthContext); // Dapatkan data dari AuthContext

    const [profileData, setProfileData] = useState({
        name: username || 'Admin VenueKu',
        email: userRole === 'admin' ? 'admin@example.com' : 'unknown@example.com', // Sesuaikan email dummy
    });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        alert('Simulasi: Profil Admin berhasil diperbarui!');
        // Di sini Anda akan mengirim data ke API backend
    };

    const handleChangePassword = () => {
        alert('Simulasi: Mengubah kata sandi admin!');
        // Di sini Anda akan mengarahkan ke halaman ubah kata sandi atau menampilkan modal
    };

    const handleLogout = () => {
        logout(); // Panggil fungsi logout dari AuthContext
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label htmlFor="adminName" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="adminName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="adminEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
                            value={profileData.email}
                            disabled // Email biasanya tidak bisa diedit
                        />
                    </div>
                    <div className="flex justify-start">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleChangePassword}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-fit"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-fit"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminProfilePage;