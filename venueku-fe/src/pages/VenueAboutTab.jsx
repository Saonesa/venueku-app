// src/pages/VenueAboutTab.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';

function VenueAboutTab() {
    const { venue } = useOutletContext(); // Mendapatkan data venue dari VenueDetailPage

    if (!venue) {
        return <p className="text-gray-600 text-center mt-4">Tidak ada informasi tentang venue ini.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Deskripsi</h3>
                <p className="text-gray-700 mb-4">{venue.description}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Alamat</h3>
                <p className="text-gray-700 mb-4">{venue.address}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Fasilitas</h3>
                <div className="grid grid-cols-3 gap-4">
                    {venue.facilities.map((fac, index) => (
                        <div key={index} className="flex flex-col items-center text-center text-gray-700">
                            <span className="text-3xl mb-1">{fac.icon}</span> {/* Menggunakan emoji sebagai ikon */}
                            <span className="text-sm">{fac.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Jam Operasional</h3>
                <ul className="mb-4">
                    {venue.operatingHours.map((op, index) => (
                        <li key={index} className="flex justify-between text-gray-700 py-1 border-b border-gray-100 last:border-b-0">
                            <span>{op.day}</span>
                            <span>{op.hours}</span>
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Informasi Kontak</h3>
                <p className="text-gray-700 mb-2">Instagram: <a href={`https://instagram.com/${venue.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{venue.contactInfo.instagram}</a></p>
                <p className="text-gray-700">Telepon: <a href={`tel:${venue.contactInfo.phone}`} className="text-blue-600 hover:underline">{venue.contactInfo.phone}</a></p>
            </div>
        </div>
    );
}

export default VenueAboutTab;