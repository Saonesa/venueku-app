// src/pages/Auth/SuperadminLoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../../components/AuthFormContainer';
import { AuthContext } from '../../contexts/AuthContext';

function SuperadminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Panggil fungsi login dari AuthContext dengan peran 'superadmin'
        await login(email, password, 'superadmin');
    };

    return (
        <AuthFormContainer>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login Superadmin Portal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Superadmin Email"
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
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    MASUK SEBAGAI SUPERADMIN
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Ini adalah portal khusus Superadmin.
            </div>
        </AuthFormContainer>
    );
}

export default SuperadminLoginPage;