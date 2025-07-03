// src/pages/VenueGalleryTab.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';

function VenueGalleryTab() {
    const { venue } = useOutletContext(); // Mendapatkan data venue dari VenueDetailPage

    if (!venue || !venue.galleryImages || venue.galleryImages.length === 0) {
        return <p className="text-gray-600 text-center mt-4">Belum ada gambar di galeri.</p>;
    }

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Galeri Venue</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {venue.galleryImages.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Gallery ${index + 1}`} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                ))}
            </div>
        </div>
    );
}

export default VenueGalleryTab;