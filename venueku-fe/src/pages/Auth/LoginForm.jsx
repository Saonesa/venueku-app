// VENUEKU-FE/src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm({ attemptedRole }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Initial state harus string kosong untuk input controlled
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await login(email, password, attemptedRole);

            if (result.success) {
                const userRole = result.user.role;
                if (result.success) {
                const userRole = result.user.role;
                if (userRole === 'superadmin') {
                    navigate('/admin/superadmin-dashboard'); 
                } else if (userRole === 'admin') {
                    navigate('/admin/dashboard'); 
                } else if (userRole === 'user') {
                    navigate('/'); 
                }
            }
            }
            // Jika result.success adalah false, error sudah di-throw dan ditangani di catch
        } catch (err) {
            console.error('Login error in LoginForm:', err);
            setError(err.message || 'Terjadi kesalahan saat login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login {attemptedRole === 'user' ? 'User' : (attemptedRole === 'admin' ? 'Pengelola Venue' : 'Superadmin')}</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Kata Sandi Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Memproses...' : 'Login'}
                </button>
                {attemptedRole === 'user' && (
                    <a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="/register/user">
                        Daftar di sini
                    </a>
                )}
            </div>
        </form>
    );
}

export default LoginForm;