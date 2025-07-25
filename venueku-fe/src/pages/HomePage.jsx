// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import FieldCard from '../components/FieldCard'; // PERBAIKAN: Import FieldCard
import api from '../services/api';

function HomePage() {
    // PERBAIKAN: Gunakan 'fields' state, bukan 'venues'
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularFields = async () => { // PERBAIKAN: Nama fungsi mencerminkan 'fields'
            try {
                // PERBAIKAN: Memanggil endpoint baru untuk lapangan populer
                const response = await api.get('/fields/popular');
                setFields(response.data); // PERBAIKAN: Set ke state 'fields'
            } catch (err) {
                console.error('Gagal mengambil daftar lapangan populer:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch popular fields.');
            } finally {
                setLoading(false);
            }
        };

        fetchPopularFields();
    }, []);

    const handleCobaGratisClick = () => {
        const whatsappNumber = ''; // Ganti dengan nomor WhatsApp yang sesuai
        const message = encodeURIComponent("Halo, saya tertarik dengan solusi pengelolaan fasilitas olahraga dari Venueku. Bisa jelaskan lebih lanjut?");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="py-8">
            {/* Bagian Hero Utama (Temukan Lapangan) - TETAP DI ATAS */}
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Temukan Lapangan Olahraga Impian Anda</h1>
                <p className="text-lg text-gray-600">Pesan dan kelola jadwal dengan mudah di Venueku.</p>
            </section>

            {/* Bagian Rekomendasi Field (Sudah Ada) */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Rekomendasi Lapangan Populer</h2> {/* PERBAIKAN: Ubah judul */}
                {loading ? (
                    <p className="text-center">Memuat lapangan populer...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error: {error}</p>
                ) : fields.length === 0 ? ( // PERBAIKAN: Cek 'fields.length'
                    <p className="text-center text-gray-600">Tidak ada lapangan populer tersedia saat ini.</p>
                ) : (
                    // PERBAIKAN: Gunakan FieldCard dan iterasi 'fields'
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {fields.map(field => (
                            <FieldCard key={field.id} field={field} />
                        ))}
                    </div>
                )}
            </section>

            {/* Bagian Khusus Pemilik Bisnis - TETAP DI BAWAH */}
            <section
                className="relative bg-cover bg-center h-[400px] flex items-center justify-start p-8 md:p-12 rounded-lg mb-12"
                style={{ backgroundImage: "url('/images/business_hero_bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black opacity-60 rounded-lg"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <p className="text-lg font-semibold mb-2">Khusus Pemilik Bisnis</p>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Solusi Kelola<br />Fasilitas Olahraga<br />Anda
                    </h2>
                    <p className="text-base md:text-lg mb-6">
                        Tingkatkan Potensi Pendapatan Lapangan & Nikmati <span className="font-bold">#BisnisMakinMudah</span> dalam mengelola venue olahraga
                    </p>
                    <button
                        onClick={handleCobaGratisClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        COBA GRATIS SEKARANG
                    </button>
                </div>
            </section>
        </div>
    );
}

export default HomePage;