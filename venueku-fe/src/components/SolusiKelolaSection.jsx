// src/components/SolusiKelolaSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function SolusiKelolaSection() {
    const navigate = useNavigate(); // Inisialisasi useNavigate hook

    const handleDaftarSekarangClick = () => {
        navigate('/register/admin'); // Arahkan ke halaman registrasi admin
    };

    return (
        <section className="bg-blue-700 text-white p-8 rounded-lg mb-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 order-2 md:order-1 md:pr-10 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Solusi Kelola Fasilitas Olahraga Anda</h2>
                <p className="mb-6">Wujudkan mimpi Anda menjadi wirausahawan dengan mengelola fasilitas olahraga Anda secara profesional.</p>
                <button
                    onClick={handleDaftarSekarangClick} // Tambahkan event handler
                    className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors duration-200"
                >
                    DAFTAR SEKARANG
                </button>
            </div>
            <div className="md:w-1/2 order-1 md:order-2 mb-6 md:mb-0">
                <img
                    src="https://via.placeholder.com/600x300?text=Facility+Management"
                    alt="Kelola Fasilitas Olahraga"
                    className="w-full h-auto rounded-lg shadow-md"
                />
            </div>
        </section>
    );
}

export default SolusiKelolaSection;