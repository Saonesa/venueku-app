// src/components/VenueCard.jsx
import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

function VenueCard({ venue }) {
    const { isLoggedIn } = useContext(AuthContext); // Dapatkan status login
    const navigate = useNavigate();

    // Data dummy untuk slot waktu (akan diganti dengan data dari API di VenueListingPage)
    const dummySlots = [
        { id: 's1', time: '08:00 - 09:00', isAvailable: true },
        { id: 's2', time: '09:00 - 10:00', isAvailable: false },
        { id: 's3', time: '10:00 - 11:00', isAvailable: true },
        { id: 's4', time: '11:00 - 12:00', isAvailable: true },
    ];

    const handleLihatDetailClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Mencegah navigasi default Link
            alert('Anda harus login untuk melihat detail venue dan jadwal.'); // Menggunakan alert, bisa diganti modal kustom
            navigate('/login/user'); // Arahkan ke halaman login user
        }
        // Jika isLoggedIn true, Link akan berfungsi normal
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={venue.imageUrl || '[https://via.placeholder.com/400x250?text=Venue+Image](https://via.placeholder.com/400x250?text=Venue+Image)'}
                alt={venue.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{venue.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{venue.location}</p>
                <p className="text-gray-700 font-bold mb-2">
                    Rp {venue.minPrice.toLocaleString('id-ID')} - Rp {venue.maxPrice.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-500 text-xs">/ sesi</p>

                {/* Bagian Slot Waktu */}
                <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium text-gray-700 mb-2">Slot Tersedia Hari Ini:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {dummySlots.map(slot => (
                            <button
                                key={slot.id}
                                className={`py-1 px-2 rounded-md transition-colors duration-200
                  ${slot.isAvailable
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-70'
                                    }`}
                                disabled={!slot.isAvailable}
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        alert('Anda harus login untuk memesan slot.');
                                        navigate('/login/user');
                                    } else if (slot.isAvailable) {
                                        alert(`Booking ${venue.name} - ${slot.time}`); // Placeholder aksi booking
                                    }
                                }}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>

                <Link
                    to={`/venue/${venue.id}`}
                    onClick={handleLihatDetailClick} // Tambahkan event handler di sini
                    className="mt-4 block text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                    Lihat Lebih Lengkap
                </Link>
            </div>
        </div>
    );
}

export default VenueCard;