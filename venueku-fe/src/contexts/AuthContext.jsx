// VENUEKU-FE/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; 
import axios from 'axios'; 
import { getCookie } from '../utils/cookies'; // Mengimpor fungsi getCookie Anda

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State untuk menyimpan data pengguna yang login
    const [user, setUser] = useState(null);
    // State untuk menyimpan token otentikasi dari backend
    const [authToken, setAuthToken] = useState(null);
    // State untuk menandakan apakah proses autentikasi awal sedang berjalan
    const [loading, setLoading] = useState(true); 

    // useEffect: Memuat status autentikasi dari localStorage saat aplikasi pertama kali dimuat
    useEffect(() => {
        // PERBAIKAN: Menggunakan localStorage untuk konsistensi dengan api.js interceptor
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                // Mem-parsing data user yang disimpan sebagai string JSON
                const userData = JSON.parse(storedUser);
                setAuthToken(storedToken);
                setUser(userData);
            } catch (e) {
                // Jika parsing gagal (data rusak), bersihkan localStorage
                console.error("AuthContext: Gagal mem-parsing data user dari localStorage:", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false); // Selesai memuat status autentikasi awal
    }, []); // Array dependensi kosong agar hanya berjalan sekali (saat mount)

    /**
     * Helper Function: Mengambil CSRF cookie dari Laravel Sanctum.
     * Penting untuk request POST/PUT/DELETE dari SPA agar terhindar dari CSRF Mismatch.
     */
    const fetchCsrfCookie = async () => {
        try {
            // Memanggil endpoint CSRF cookie menggunakan axios murni (bukan instance 'api')
            // Karena '/sanctum/csrf-cookie' tidak berada di bawah '/api' prefix dari api instance.
            // .replace('/api', '') akan mengubah base URL dari "http://127.0.0.1:8000/api" menjadi "http://127.0.0.1:8000"
            // Pastikan VITE_API_BASE_URL Anda berakhir dengan '/api' (misal: http://localhost:8000/api)
            await axios.get(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/sanctum/csrf-cookie', { withCredentials: true });
        } catch (error) {
            console.error("AuthContext: Gagal mengambil CSRF cookie:", error);
            // Melempar error agar komponen yang memanggil bisa menanganinya (misal menampilkan alert)
            throw new Error("Gagal menginisialisasi sesi keamanan. Mohon coba lagi.");
        }
    };

    /**
     * Fungsi untuk menangani proses login pengguna.
     * Akan memanggil backend Laravel.
     * @param {string} email - Email pengguna
     * @param {string} password - Password pengguna
     * @param {string} attemptedRole - Role yang dicoba saat login (misal: 'user', 'admin', 'superadmin')
     */
    const login = async (email, password, attemptedRole) => {
        setLoading(true); // Menandakan proses login sedang berjalan
        try {
            await fetchCsrfCookie(); // Ambil CSRF cookie sebelum request login (POST)
            const csrfToken = getCookie('XSRF-TOKEN'); // Ambil nilai token dari cookie Anda

            const response = await api.post('/login', { email, password }, {
                headers: {
                    // Menambahkan X-XSRF-TOKEN secara manual karena interceptor api.js hanya menangani Authorization
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '', 
                }
            });

            const { token, user: userData } = response.data; // Destrukturisasi response data

            // PERBAIKAN: Simpan token dan data user ke localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Perbarui state konteks
            setAuthToken(token);
            setUser(userData);

            // === Logika Validasi Role Sesuai Portal Login ===
            // Jika role yang dicoba tidak sesuai dengan role aktual user dari backend
            if (attemptedRole && userData.role !== attemptedRole) {
                await logout(false); // Logout di frontend saja tanpa memanggil backend lagi
                throw new Error(`Login gagal: Akun ini adalah ${userData.role}, silakan login melalui portal yang sesuai.`);
            }

            // Contoh penanganan spesifik untuk admin/superadmin yang login di portal yang salah
            if (attemptedRole === 'admin' && userData.role === 'superadmin') {
                await logout(false);
                throw new Error('Login gagal: Akun ini adalah Superadmin, silakan login melalui portal Superadmin.');
            }
            if (attemptedRole === 'user' && userData.role === 'admin') {
                await logout(false);
                throw new Error('Login gagal: Akun ini adalah Pengelola Venue, silakan login melalui portal Pengelola Venue.');
            }

            console.log(`AuthContext: Login sebagai ${userData.role} (${userData.name}) berhasil!`);
            return { success: true, user: userData }; // Mengembalikan status keberhasilan
        } catch (err) {
            console.error("AuthContext: Login error:", err.response?.data || err.message);
            // Tangani error spesifik dari backend (misal: 401 Unauthorized)
            if (err.response && err.response.status === 401) {
                throw new Error('Email atau kata sandi salah. Jika belum punya akun, silakan daftar.');
            }
            // Lempar error umum jika ada masalah lain
            throw new Error(err.response?.data?.message || 'Login gagal. Pastikan email dan password benar.');
        } finally {
            setLoading(false); // Menandakan proses login selesai
        }
    };

    /**
     * Fungsi untuk menangani proses registrasi pengguna baru.
     * Akan memanggil backend Laravel, lalu otomatis login.
     * @param {string} email - Email pengguna baru
     * @param {string} password - Password pengguna baru
     * @param {string} name - Nama pengguna baru
     * @param {string} role - Role pengguna ('user')
     */
     const register = async (email, password, name, role, passwordConfirmation) => {
        setLoading(true);
        try {
            if (role !== 'user') {
                throw new Error("Pendaftaran hanya tersedia untuk role 'user'.");
            }

            await fetchCsrfCookie();
            const csrfToken = getCookie('XSRF-TOKEN');

            const response = await api.post('/register', {
                email,
                password,
                name,
                role,
                password_confirmation: passwordConfirmation
            }, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                }
            });

            const loginResult = await login(email, password, role);

            if (loginResult.success) {
                console.log(`AuthContext: Registrasi dan Login otomatis berhasil sebagai ${loginResult.user.role} (${loginResult.user.name})!`);
                return { success: true, user: loginResult.user };
            } else {
                throw new Error(loginResult.message || 'Registrasi berhasil, tetapi login otomatis gagal.');
            }
        } catch (err) {
            console.error("AuthContext: Register error:", err.response?.data || err.message);

            
            if (err.response?.status === 422 && err.response.data?.errors) {
                const validationErrors = err.response.data.errors;
                const firstErrorKey = Object.keys(validationErrors)[0]; // Ambil nama field error pertama
                const firstErrorMessage = validationErrors[firstErrorKey][0]; // Ambil pesan error pertama dari field itu

                // Melempar error dengan pesan yang lebih spesifik
                throw new Error(`${firstErrorMessage}`); // Cukup lempar pesan spesifik
            }
            throw new Error(err.response?.data?.message || 'Registrasi gagal.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fungsi untuk menangani proses logout pengguna.
     * Akan memanggil backend Laravel untuk menginvalidasi token.
     * @param {boolean} callBackend - True jika perlu memanggil endpoint logout backend (default: true)
     */
    const logout = async (callBackend = true) => {
        setLoading(true); // Menandakan proses logout sedang berjalan
        try {
            if (callBackend && authToken) { // Panggil endpoint logout backend hanya jika ada token dan callBackend true
                // Pastikan CSRF cookie diambil sebelum request POST logout
                await fetchCsrfCookie(); 
                const csrfToken = getCookie('XSRF-TOKEN');
                await api.post('/logout', {}, { // Kirim body kosong atau {}
                    headers: {
                        'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                    }
                });
            }
        } catch (error) {
            console.error("AuthContext: Backend logout failed or token already invalid:", error);
        } finally {
            // PERBAIKAN: Bersihkan token dan data user dari localStorage dan state konteks
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setAuthToken(null);
            setUser(null);
            setLoading(false); // Menandakan proses logout selesai
            window.location.href = '/login/user'; // Redirect ke halaman login utama
        }
    };

    /**
     * Fungsi untuk Superadmin: Mengelola (fetch) daftar user atau partner.
     * Membutuhkan role 'superadmin'.
     *
     * @param {string} targetRole - 'user' atau 'admin' (untuk partner)
     * @param {number} page - Nomor halaman untuk paginasi (default 1)
     * @param {number} perPage - Jumlah item per halaman (default 10)
     */
    const manageUsers = async (targetRole, page = 1, perPage = 10) => { // TAMBAHKAN PARAMETER page & perPage
        if (user?.role !== 'superadmin') {
            throw new Error('Akses ditolak. Hanya Superadmin yang bisa mengelola pengguna ini.');
        }
        try {
            let endpoint = '';
            if (targetRole === 'user') {
                endpoint = `/superadmin/users`;
            } else if (targetRole === 'admin') { // 'admin' role di backend kita adalah partner
                endpoint = `/superadmin/partners`;
            }
            // Meneruskan parameter paginasi ke backend
            const response = await api.get(`${endpoint}?page=${page}&per_page=${perPage}`);
            // Backend PartnerController@index dan UserController@index sudah mengembalikan objek paginasi
            // yang diformat oleh paginate()->through() atau paginate() langsung.
            // Objek response.data akan sudah berisi 'data', 'current_page', 'last_page', 'total'
            return response.data; // Mengembalikan objek paginasi lengkap
        } catch (err) {
            console.error(`AuthContext: Error fetching ${targetRole}s:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || `Gagal mengambil daftar ${targetRole}s.`);
        }
    };

    /**
     * Fungsi untuk Superadmin: Menambah user atau partner baru dari panel admin.
     * Membutuhkan role 'superadmin'. TIDAK akan otomatis login atau redirect.
     * @param {object} data - Data user/partner baru
     * @param {string} targetRole - 'user' atau 'admin'
     */
    const addUser = async (data, targetRole) => {
        if (user?.role !== 'superadmin') {
            throw new Error('Akses ditolak. Hanya Superadmin yang bisa menambah pengguna.');
        }
        try {
            await fetchCsrfCookie(); // Ambil CSRF token
            const csrfToken = getCookie('XSRF-TOKEN');

            let endpoint = '';
            if (targetRole === 'user') {
                endpoint = '/superadmin/users';
            } else if (targetRole === 'admin') {
                endpoint = '/superadmin/partners';
                data.venueName = data.venueName || null;
            }
            // api instance akan menambahkan Authorization, dan kita tambahkan X-XSRF-TOKEN
            const response = await api.post(endpoint, data, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                }
            });
            return response.data; // Mengembalikan data response (biasanya user yang baru dibuat)
        } catch (err) {
            console.error(`AuthContext: Error adding ${targetRole}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || `Gagal menambah ${targetRole}.`);
        }
    };

    /**
     * Fungsi untuk Superadmin: Memperbarui user atau partner.
     * Membutuhkan role 'superadmin'.
     * @param {number} id - ID user/partner
     * @param {object} data - Data yang diperbarui
     * @param {string} targetRole - 'user' atau 'admin'
     */
    const updateUser = async (id, data, targetRole) => {
        if (user?.role !== 'superadmin') {
            throw new Error('Akses ditolak. Hanya Superadmin yang bisa mengedit pengguna.');
        }
        try {
            await fetchCsrfCookie(); // Ambil CSRF token
            const csrfToken = getCookie('XSRF-TOKEN');

            let endpoint = '';
            if (targetRole === 'user') {
                endpoint = `/superadmin/users/${id}`;
            } else if (targetRole === 'admin') {
                endpoint = `/superadmin/partners/${id}`;
                data.venueName = data.venueName || null;
            }
            // api instance akan menambahkan Authorization, dan kita tambahkan X-XSRF-TOKEN
            const response = await api.put(endpoint, data, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                }
            });
            return response.data;
        } catch (err) {
            console.error(`AuthContext: Error updating ${targetRole}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || `Gagal memperbarui ${targetRole}.`);
        }
    };

    /**
     * Fungsi untuk Superadmin: Menghapus user atau partner.
     * Membutuhkan role 'superadmin'.
     * @param {number} id - ID user/partner
     * @param {string} targetRole - 'user' atau 'admin'
     */
    const deleteUser = async (id, targetRole) => {
        if (user?.role !== 'superadmin') {
            throw new Error('Akses ditolak. Hanya Superadmin yang bisa menghapus pengguna.');
        }
        try {
            await fetchCsrfCookie(); // Ambil CSRF token
            const csrfToken = getCookie('XSRF-TOKEN');

            let endpoint = '';
            if (targetRole === 'user') {
                endpoint = `/superadmin/users/${id}`;
            } else if (targetRole === 'admin') {
                endpoint = `/superadmin/partners/${id}`;
            }
            // api instance akan menambahkan Authorization, dan kita tambahkan X-XSRF-TOKEN
            const response = await api.delete(endpoint, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                }
            });
            return response.data;
        } catch (err) {
            console.error(`AuthContext: Error deleting ${targetRole}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || `Gagal menghapus ${targetRole}.`);
        }
    };

    const authContextValue = {
        user,
        authToken,
        loading,
        isLoggedIn: !!authToken,
        userRole: user?.role || null,
        username: user?.name || null,
        userId: user?.id || null,
        isSuperadmin: user?.role === 'superadmin',
        login,
        register,
        logout,
        manageUsers,
        addUser,
        updateUser,
        deleteUser,
        fetchCsrfCookie, // Mengekspos fetchCsrfCookie agar bisa dipanggil dari komponen lain (misal AdminFieldsPage)
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};