// VENUEKU-FE/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api'; // Import api instance
import { getCookie } from '../utils/cookies'; // <<< IMPORT getCookie
import axios from 'axios'; // <<< IMPORT axios untuk fetch csrf-cookie

// Helper function untuk mendapatkan inisial nama pengguna
const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '??';
    return `${parts[0][0]?.toUpperCase()}${parts[parts.length - 1][0]?.toUpperCase()}`;
};

function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        birthDate: '',
        gender: '',
        phoneNumber: '',
        location: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // useEffect: Mengambil data profil dari backend saat komponen dimuat atau user/authLoading berubah
    useEffect(() => {
        const fetchProfile = async () => {
            if (authLoading) return;

            if (!user) {
                setLoading(false);
                setError('Detail profil tidak tersedia. Mohon login.');
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/profile');
                setProfileData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    birthDate: response.data.birthDate ? new Date(response.data.birthDate).toISOString().split('T')[0] : '',
                    gender: response.data.gender || '',
                    phoneNumber: response.data.phoneNumber || '',
                    location: response.data.location || '',
                });
            } catch (err) {
                console.error('Gagal mengambil data profil:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, authLoading]);

    // Fungsi untuk memperbarui data profil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        try {
            // <<< BARIS BARU UNTUK CSRF COOKIE >>>
            // Panggil endpoint CSRF cookie menggunakan axios biasa
            // dan hilangkan '/api' dari baseURL Axios instance kita
            await axios.get(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/sanctum/csrf-cookie', { withCredentials: true });
            // Ambil nilai token dari cookie
            const csrfToken = getCookie('XSRF-TOKEN');

            const response = await api.put('/profile', {
                name: profileData.name,
                email: profileData.email,
                birthDate: profileData.birthDate,
                gender: profileData.gender,
                phoneNumber: profileData.phoneNumber,
                location: profileData.location,
            }, {
                // <<< TAMBAH HEADERS INI KE REQUEST PUT >>>
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });
            console.log('Profil berhasil diperbarui:', response.data);
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            console.error('Gagal memperbarui profil:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = () => {
        alert('Simulasi: Mengarahkan ke halaman ubah kata sandi!');
    };

    if (loading || authLoading) return <p className="text-center py-12">Memuat profil...</p>;
    if (error) return <p className="text-center py-12 text-red-500">Error: {error}</p>;
    if (!user) return <p className="text-center py-12 text-gray-600">Anda belum login atau profil tidak tersedia.</p>;

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil Pengguna</h1>
            <p className="text-gray-600 mb-8">Lengkapi profil Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-blue-500 flex items-center justify-center bg-blue-100 text-blue-800 text-5xl font-bold">
                        {getInitials(profileData.name)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{profileData.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{profileData.email}</p>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Profil</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                                <input type="text" id="fullName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input type="email" id="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
                                    value={profileData.email}
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir</label>
                                <input type="date" id="birthDate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.birthDate}
                                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                                <select id="gender"
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
                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                                <input type="tel" id="phoneNumber"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.phoneNumber}
                                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Lokasi</label>
                                <input type="text" id="location"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={isUpdating}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 focus:outline-none focus:shadow-outline mt-6">
                            {isUpdating ? 'Menyimpan...' : 'SIMPAN PROFIL'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;