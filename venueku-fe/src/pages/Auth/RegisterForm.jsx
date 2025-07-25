// VENUEKU-FE/src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // DEBUGGING: Cek nilai state di sini
        console.log("DEBUG: Password saat submit =", password);
        console.log("DEBUG: Konfirmasi Password saat submit =", passwordConfirmation);


        if (password.length < 8) {
            setError('Password harus minimal 8 karakter.');
            setLoading(false);
            return;
        }
        if (password !== passwordConfirmation) {
            setError('Konfirmasi password tidak cocok.');
            setLoading(false);
            return;
        }

        try {
            const result = await register(email, password, name, 'user', passwordConfirmation);

            if (result.success) {
                alert(`Pendaftaran sebagai ${result.user.role} (${result.user.name}) berhasil! Anda akan diarahkan ke halaman utama.`);
                navigate('/');
            }
        } catch (err) {
            console.error('Register error in RegisterForm:', err);
            setError(err.message || 'Terjadi kesalahan saat registrasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Akun Pengguna</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nama Lengkap
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
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
                    placeholder="Kata Sandi (min. 8 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                    Konfirmasi Password
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password_confirmation"
                    type="password"
                    placeholder="Ketik ulang kata sandi Anda"
                    value={passwordConfirmation}
                    // PERBAIKAN SANGAT KECIL: Pastikan value selalu string, bahkan jika e.target.value entah kenapa null/undefined
                    onChange={(e) => setPasswordConfirmation(String(e.target.value))}
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Memproses...' : 'Daftar'}
                </button>
                <a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="/login/user">
                    Sudah punya akun? Login
                </a>
            </div>
        </form>
    );
}

export default RegisterForm;