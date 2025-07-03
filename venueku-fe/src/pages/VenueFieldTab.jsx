// src/pages/VenueFieldTab.jsx
import React from 'react';
import { useOutletContext, Link } from 'react-router-dom'; // Import Link

function VenueFieldTab() {
    const { venue } = useOutletContext(); // Mendapatkan data venue dari VenueDetailPage

    if (!venue || !venue.fields || venue.fields.length === 0) {
        return <p className="text-gray-600 text-center mt-4">Tidak ada informasi lapangan yang tersedia.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.fields.map(field => (
                <div key={field.id} className="bg-gray-50 rounded-lg shadow-sm p-4">
                    <img src={field.imageUrl} alt={field.name} className="w-full h-40 object-cover rounded-md mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{field.name}</h3>
                    <p className="text-gray-600 mb-2">{field.type}</p>
                    <p className="text-gray-700 font-bold mb-4">Rp {field.price.toLocaleString('id-ID')}</p>
                    <Link // Menggunakan Link untuk navigasi
                        to={`/venue/${venue.id}/field/${field.id}/schedule`} // Path ke halaman jadwal
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
                    >
                        LIHAT JADWAL
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default VenueFieldTab;