// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import BroadcastYourMateSection from '../components/BroadcastYourMateSection';
import SolusiKelolaSection from '../components/SolusiKelolaSection';

function HomePage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // --- Simulasi Fetch Data Venue (Ganti dengan API Sahrul nanti) ---
        const fetchVenues = async () => {
            try {
                // Data dummy untuk tampilan awal
                const dummyVenues = [
                    { id: 1, name: 'Lapangan Futsal Senayan', location: 'Jakarta Pusat', minPrice: 250000, maxPrice: 350000, imageUrl: 'https://via.placeholder.com/400x250?text=Futsal+Senayan' },
                    { id: 2, name: 'Lapangan Badminton Cilandak', location: 'Jakarta Selatan', minPrice: 100000, maxPrice: 150000, imageUrl: 'https://via.placeholder.com/400x250?text=Badminton+Cilandak' },
                    { id: 3, name: 'Lapangan Basket GOR', location: 'Bandung', minPrice: 300000, maxPrice: 400000, imageUrl: 'https://via.placeholder.com/400x250?text=Basket+GOR' },
                    { id: 4, name: 'Mini Soccer Arena', location: 'Surabaya', minPrice: 400000, maxPrice: 500000, imageUrl: 'https://via.placeholder.com/400x250?text=Mini+Soccer' },
                    { id: 5, name: 'Lapangan Tenis Ciamis', location: 'Ciamis', minPrice: 150000, maxPrice: 200000, imageUrl: 'https://via.placeholder.com/400x250?text=Tenis+Ciamis' },
                    { id: 6, name: 'Kolam Renang Ciputat', location: 'Tangerang Selatan', minPrice: 75000, maxPrice: 100000, imageUrl: 'https://via.placeholder.com/400x250?text=Kolam+Renang' },
                    { id: 7, name: 'Arena Panahan', location: 'Bogor', minPrice: 120000, maxPrice: 180000, imageUrl: 'https://via.placeholder.com/400x250?text=Panahan+Arena' },
                    { id: 8, name: 'Lapangan Voli Pantai', location: 'Bali', minPrice: 200000, maxPrice: 250000, imageUrl: 'https://via.placeholder.com/400x250?text=Voli+Pantai' },
                ];
                setVenues(dummyVenues);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    return (
        <div className="py-8"> {/* <<< HAPUS "container mx-auto p-4" DARI SINI */}
            {/* Bagian Hero atau Slogan (opsional, bisa diubah sesuai mockup pertama) */}
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Temukan Lapangan Olahraga Impian Anda</h1>
                <p className="text-lg text-gray-600">Pesan dan kelola jadwal dengan mudah di VenueKu.</p>
            </section>

            {/* Daftar Venue */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Rekomendasi Field</h2>
                {loading ? (
                    <p className="text-center">Memuat field...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error: {error}</p>
                ) : venues.length === 0 ? (
                    <p className="text-center text-gray-600">Tidak ada venue tersedia saat ini.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {venues.map(venue => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                )}
            </section>

            {/* Bagian "BROADCAST YOUR MATE" */}
            <BroadcastYourMateSection />

            {/* Bagian "SOLUSI KELOLA FASILITAS OLAHRAGA ANDA" */}
            <SolusiKelolaSection />
        </div>
    );
}

export default HomePage;