// VENUEKU-FE/src/pages/VenueListingPage.jsx
import React, { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../services/api';

function VenueListingPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1); // New state for current page
    const venuesPerPage = 8; // Number of venues per page

    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (selectedCity) {
                    params.city = selectedCity;
                }
                if (selectedSport) {
                    params.sport = selectedSport;
                }
                // Anda bisa menambahkan filter tanggal jika backend mendukungnya
                // params.date = selectedDate.toISOString().split('T')[0];

                const response = await api.get('/venues', { params });
                setVenues(response.data);
                setCurrentPage(1); // Reset to first page on new search/filter
            } catch (err) {
                console.error('Gagal mengambil daftar venues:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch venues.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, [selectedCity, selectedSport, selectedDate]);

    const handleSearch = () => {
        console.log('Melakukan pencarian dengan:', { selectedCity, selectedSport, selectedDate });
        // The useEffect will handle re-fetching based on changes to selectedCity, selectedSport, selectedDate
    };

    // Calculate the venues to display on the current page
    const indexOfLastVenue = currentPage * venuesPerPage;
    const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
    const currentVenues = venues.slice(indexOfFirstVenue, indexOfLastVenue);

    // Calculate total pages
    const totalPages = Math.ceil(venues.length / venuesPerPage);

    // Function to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Booking Venue Olahraga Terbaik</h1>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Berikut Venue Olahraga di Semua Kota yang memiliki standar kualitas terbaik untuk memanjakan pengalaman berolahraga Anda.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
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
                    <option value="Semarang">Semarang</option>
                </select>

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

                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd-MM-yyyy"
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                />

                <button onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                    Cari Lapangan
                </button>
            </div>

            <section className="mb-12">
                {loading ? (
                    <p className="text-center">Memuat field...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error: {error}</p>
                ) : venues.length === 0 ? (
                    <p className="text-center text-gray-600">Tidak ada venue tersedia saat ini.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentVenues.map(venue => ( // Use currentVenues here
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination controls */}
            {totalPages > 1 && ( // Only show pagination if there's more than 1 page
                <div className="flex justify-center items-center space-x-2 mt-8">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 rounded-md ${i + 1 === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VenueListingPage;