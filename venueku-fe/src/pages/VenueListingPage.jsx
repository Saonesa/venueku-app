// src/pages/VenueListingPage.jsx
import React, { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function VenueListingPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // --- Simulasi Fetch Data Venue (Ganti dengan API Sahrul nanti) ---
        const fetchVenues = async () => {
            setLoading(true);
            try {
                // Data dummy untuk pengembangan awal
                const dummyVenues = [
                    { id: 1, name: 'Lapangan Futsal Senayan', location: 'Jakarta Pusat', sportType: 'Futsal', minPrice: 250000, maxPrice: 350000, imageUrl: 'https://via.placeholder.com/400x250?text=Futsal+Senayan' },
                    { id: 2, name: 'Lapangan Badminton Cilandak', location: 'Jakarta Selatan', sportType: 'Badminton', minPrice: 100000, maxPrice: 150000, imageUrl: 'https://via.placeholder.com/400x250?text=Badminton+Cilandak' },
                    { id: 3, name: 'Lapangan Basket GOR', location: 'Bandung', sportType: 'Basket', minPrice: 300000, maxPrice: 400000, imageUrl: 'https://via.placeholder.com/400x250?text=Basket+GOR' },
                    { id: 4, name: 'Mini Soccer Arena', location: 'Surabaya', sportType: 'Sepak Bola', minPrice: 400000, maxPrice: 500000, imageUrl: 'https://via.placeholder.com/400x250?text=Mini+Soccer' },
                    { id: 5, name: 'Lapangan Tenis Ciamis', location: 'Ciamis', sportType: 'Tenis', minPrice: 150000, maxPrice: 200000, imageUrl: 'https://via.placeholder.com/400x250?text=Tenis+Ciamis' },
                    { id: 6, name: 'Kolam Renang Ciputat', location: 'Tangerang Selatan', sportType: 'Renang', minPrice: 75000, maxPrice: 100000, imageUrl: 'https://via.placeholder.com/400x250?text=Kolam+Renang' },
                    { id: 7, name: 'Arena Panahan', location: 'Bogor', sportType: 'Panahan', minPrice: 120000, maxPrice: 180000, imageUrl: 'https://via.placeholder.com/400x250?text=Panahan+Arena' },
                    { id: 8, name: 'Lapangan Voli Pantai', location: 'Bali', sportType: 'Voli', minPrice: 200000, maxPrice: 250000, imageUrl: 'https://via.placeholder.com/400x250?text=Voli+Pantai' },
                ];
                setVenues(dummyVenues);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, [selectedCity, selectedSport, selectedDate]); // Trigger fetch saat filter berubah

    const handleSearch = () => {
        // Di sini Anda bisa memicu fetch data lagi dengan parameter filter
        // useEffect di atas sudah diatur untuk re-fetch saat state filter berubah.
        console.log('Melakukan pencarian dengan:', { selectedCity, selectedSport, selectedDate });
    };

    return (
        <div className="py-8"> {/* <<< HAPUS "container mx-auto p-4" DARI SINI */}
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Booking Venue Olahraga Terbaik</h1>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Berikut Venue Olahraga di Semua Kota yang memiliki standar kualitas terbaik untuk memanjakan pengalaman berolahraga Anda.
            </p>

            {/* Filter/Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                {/* Filter Kota */}
                <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    <option value="">Semua Kota</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Ciamis">Ciamis</option>
                    <option value="Tangerang Selatan">Tangerang Selatan</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Bali">Bali</option>
                </select>

                {/* Filter Olahraga */}
                <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                >
                    <option value="">Semua Olahraga</option>
                    <option value="Futsal">Futsal</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Basket">Basket</option>
                    <option value="Sepak Bola">Sepak Bola</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Renang">Renang</option>
                    <option value="Panahan">Panahan</option>
                    <option value="Voli">Voli</option>
                </select>

                {/* Date Picker */}
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd-MM-yyyy"
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                />

                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
                >
                    Cari Lapangan
                </button>
            </div>

            {/* Daftar Venue Grid */}
            <section className="mb-12">
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

            {/* Pagination (Placeholder untuk MVP) */}
            <div className="flex justify-center items-center space-x-2 mt-8">
                {[...Array(5)].map((_, i) => ( // Contoh 5 halaman
                    <button
                        key={i}
                        className={`px-3 py-1 rounded-md ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default VenueListingPage;