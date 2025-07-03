// src/pages/Auth/UserRegisterPage.jsx
import React, { useState, useContext } from 'react'; // Import useContext
import { Link } from 'react-router-dom';
import AuthFormContainer from '../../components/AuthFormContainer';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

function UserRegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext); // Dapatkan fungsi register dari Context

    const handleSubmit = async (e) => { // Tambahkan async
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Kata sandi dan konfirmasi kata sandi tidak cocok!');
            return;
        }
        await register(email, password, name, 'user'); // Panggil fungsi register dari AuthContext
    };

    return (
        <AuthFormContainer>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrasi Akun User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Kata Sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
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

                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    REGISTER AKUN USER
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login/user" className="font-medium text-blue-600 hover:text-blue-500">
                    Login Akun User di sini
                </Link>
            </div>
        </AuthFormContainer>
    );
}

export default UserRegisterPage;