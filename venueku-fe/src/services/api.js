// VENUEKU-FE/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Interceptor: Menambahkan token autentikasi ke setiap request terautentikasi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // FIX: Use bracket notation to avoid overwriting headers object
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Menangani response error 401 (Unauthorized) atau 403 (Forbidden) secara global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('Unauthorized or Forbidden. Clearing token and redirecting to login...');
            localStorage.removeItem('authToken'); // Hapus token kadaluarsa
            localStorage.removeItem('user');     // Hapus data user juga
            window.location.href = '/login/user'; // Redirect penuh halaman ke halaman login utama
        }
        return Promise.reject(error);
    }
);
export default api;