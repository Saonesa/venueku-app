// src/pages/Auth/AdminLoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../../components/AuthFormContainer';
import { AuthContext } from '../../contexts/AuthContext';

function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => { // Tambahkan async
        e.preventDefault();
        await login(email, password, 'admin'); // Panggil fungsi login dari AuthContext
    };

    return (
        <AuthFormContainer>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login Akun Pengelola Venue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Kata Sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    MASUK SEBAGAI ADMIN
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                Belum punya akun?{' '}
                <Link to="/register/admin" className="font-medium text-blue-600 hover:text-blue-500">
                    Daftar Akun Pengelola Venue di sini
                </Link>
            </div>
            <div className="mt-2 text-center text-sm">
                <Link to="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Lupa kata sandi?
                </Link>
            </div>
        </AuthFormContainer>
    );
}

export default AdminLoginPage;