// src/pages/VenueFieldTab.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom'; // Hanya perlu useOutletContext di sini
import FieldCard from '../components/FieldCard'; // PERBAIKAN: Import FieldCard yang sudah ada

function VenueFieldTab() {
    // Menggunakan useOutletContext untuk mendapatkan data venue dari parent Route (VenueDetailPage)
    const { venue } = useOutletContext();

    // Tampilkan pesan jika tidak ada lapangan
    if (!venue || !venue.fields || venue.fields.length === 0) {
        return (
            <p className="text-gray-600 text-center mt-8 p-4 bg-white rounded-lg shadow-sm">
                Tidak ada informasi lapangan yang tersedia untuk venue ini.
            </p>
        );
    }

    return (
        // Gunakan layout grid yang sama dengan HomePage untuk konsistensi
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {venue.fields.map(field => (
                <FieldCard key={field.id} field={field} />
            ))}
        </div>
    );
}

export default VenueFieldTab;