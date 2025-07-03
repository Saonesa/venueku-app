// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../../components/AuthFormContainer';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Kata sandi dan konfirmasi kata sandi tidak cocok!');
            return;
        }
        // Logika register akan diintegrasikan dengan backend nanti
        console.log('Register attempt:', { name, email, password });
        alert('Registrasi form submitted! (Integrasi backend menyusul)');
    };

    return (
        <AuthFormContainer>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tombol "Masuk dengan Google" */}
                <button
                    type="button"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-2" />
                    REGISTER DENGAN GOOGLE
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">ATAU</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Input Nama */}
                <div>
                    <label htmlFor="name" className="sr-only">Nama Lengkap</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Nama Lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Kata Sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Input Konfirmasi Password */}
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Konfirmasi Kata Sandi</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Konfirmasi Kata Sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Tombol Register */}
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    REGISTER SEKARANG
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Login di sini
                </Link>
            </div>
        </AuthFormContainer>
    );
}

export default RegisterPage;