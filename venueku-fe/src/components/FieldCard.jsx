// src/components/FieldCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom

function FieldCard({ field }) {
    // Pastikan objek 'field' memiliki semua properti yang dibutuhkan
    // Dan pastikan 'field.venue' juga ada karena kita akan menggunakannya untuk Link
    if (!field || !field.venue) {
        return null; // Atau tampilkan placeholder jika data tidak lengkap
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img
                src={field.photo_url || 'https://via.placeholder.com/400x250?text=Field+Image'}
                alt={field.name}
                className="w-full h-48 object-cover" // Ubah tinggi menjadi h-48 atau sesuai desain Anda
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">{field.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{field.sport_type} di {field.venue.name}</p>
                <p className="text-gray-700 font-bold mb-4">
                    Rp{field.price_per_hour?.toLocaleString('id-ID')} / jam
                </p>
                <Link
                    to={`/venue/${field.venue.id}/field/${field.id}/schedule`} // Pastikan Link sesuai dengan rute Anda
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center transition duration-200"
                >
                    LIHAT JADWAL
                </Link>
            </div>
        </div>
    );
}

export default FieldCard;