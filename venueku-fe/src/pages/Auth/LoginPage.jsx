// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../../components/AuthFormContainer';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika login akan diintegrasikan dengan backend nanti
        console.log('Login attempt:', { email, password });
        alert('Login form submitted! (Integrasi backend menyusul)');
    };

    return (
        <AuthFormContainer>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tombol "Masuk dengan Google" */}
                <button
                    type="button"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
                >
                    {/* Asumsikan Anda memiliki ikon Google di assets atau gunakan CDN */}
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-2" />
                    MASUK DENGAN GOOGLE
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">ATAU</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Input Email */}
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

                {/* Input Password */}
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

                {/* Tombol Login */}
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    MASUK
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                Belum punya akun?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Daftar di sini
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

export default LoginPage;