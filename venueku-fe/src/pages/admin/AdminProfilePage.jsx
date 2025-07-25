// src/pages/Admin/AdminProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api'; // Import instance API Anda
import { getCookie } from '../../utils/cookies'; // Import utility cookie

function AdminProfilePage() {
    const { user, userId, logout, fetchCsrfCookie } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        birthDate: user?.birthDate || '', // Menggunakan properti birthDate dari BE
        gender: user?.gender || '',
        phoneNumber: user?.phoneNumber || '', // Menggunakan properti phoneNumber dari BE
        location: user?.location || '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !userId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/profile'); // Menggunakan endpoint /profile universal
                setProfileData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    birthDate: response.data.birthDate || '', // Pastikan ini cocok dengan properti dari backend
                    gender: response.data.gender || '',
                    phoneNumber: response.data.phoneNumber || '', // Pastikan ini cocok dengan properti dari backend
                    location: response.data.location || '',
                });
            } catch (err) {
                console.error("Gagal mengambil data profil:", err.response?.data || err.message);
                setError(err.response?.data?.message || 'Gagal memuat data profil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, userId]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await fetchCsrfCookie();
            const csrfToken = getCookie('XSRF-TOKEN');
            if (!csrfToken) {
                throw new Error('Token CSRF tidak ditemukan. Coba refresh halaman.');
            }

            const response = await api.put('/profile', {
                name: profileData.name,
                // Email tidak dikirim karena disabled di frontend
                birthDate: profileData.birthDate, // Mengirim properti birthDate ke backend
                gender: profileData.gender,
                phoneNumber: profileData.phoneNumber, // Mengirim properti phoneNumber ke backend
                location: profileData.location,
            }, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            console.log('Profil berhasil diperbarui:', response.data);
            setSuccessMessage('Profil berhasil diperbarui!');
        } catch (err) {
            console.error('Gagal memperbarui profil:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.response?.data?.errors?.name?.[0] || 'Gagal memperbarui profil.';
            setError(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return <p className="text-center py-12 text-gray-700">Memuat profil...</p>;
    }
    if (error && (!profileData.name && !profileData.email)) {
        return <p className="text-center py-12 text-red-500">Error: {error}</p>;
    }
    if (!user) {
        return <p className="text-center py-12 text-gray-600">Anda belum login atau profil tidak tersedia.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil Admin</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Profil</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                        <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            id="fullName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                        />
                    </div>
                    {/* Email (Disabled) */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
                            value={profileData.email}
                            disabled
                        />
                    </div>
                    {/* Tanggal Lahir */}
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
                    {/* Jenis Kelamin */}
                    <div>
                        <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                        <select
                            id="gender"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={profileData.gender}
                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        >
                            <option value="">Pilih</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    {/* Nomor Telepon */}
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
                    {/* Lokasi */}
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

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {isUpdating ? 'Menyimpan...' : 'Perbarui Profil'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sesi Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sesi</h2>
                <div className="flex flex-col space-y-4">
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