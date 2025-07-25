// VENUEKU-FE/src/components/VenueCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function VenueCard({ venue }) {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLihatDetailClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Mencegah navigasi default Link
            alert('Anda harus login untuk melihat detail venue dan jadwal.');
            navigate('/login/user'); // Arahkan ke halaman login user
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={venue.image_url || 'https://via.placeholder.com/400x250?text=Venue+Image'}
                alt={venue.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{venue.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{venue.location}</p>
                <p className="text-gray-700 font-bold mb-2">
                    Rp{venue.min_price?.toLocaleString('id-ID')} - Rp{venue.max_price?.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-500 text-xs">/ sesi</p>

                <Link to={`/venue/${venue.id}`}
                    onClick={handleLihatDetailClick}
                    className="mt-4 block text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                    Lihat Lebih Lengkap
                </Link>
            </div>
        </div>
    );
}

export default VenueCard;