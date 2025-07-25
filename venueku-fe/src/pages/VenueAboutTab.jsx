// VENUEKU-FE/src/pages/VenueAboutTab.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';

function VenueAboutTab() {
    const { venue } = useOutletContext(); // Mendapatkan data venue dari VenueDetailPage

    if (!venue) {
        return <p className="text-gray-600 text-center mt-4">Tidak ada informasi tentang venue ini.</p>;
    }

    // --- Perbaikan: Proses facilities_details dari string menjadi array objek dengan ikon yang fleksibel ---
    const processedFacilities = [];
    if (venue.facilities) { 
        // Pisahkan string menjadi array nama, dan trim setiap nama untuk membersihkan spasi
        const facilityNames = venue.facilities.split(',').map(name => name.trim()); 

        facilityNames.forEach(name => {
            let icon = ''; // Default icon jika tidak ditemukan
            const lowerCaseName = name.toLowerCase(); // Konversi ke lowercase sekali untuk efisiensi

            // Gunakan .includes() untuk mencocokkan jika nama mengandung kata kunci
            if (lowerCaseName.includes('mushola')) {
                icon = '🕌';
            } else if (lowerCaseName.includes('wc') || lowerCaseName.includes('toilet')) { // Tambahkan 'toilet' juga
                icon = '🚾';
            } else if (lowerCaseName.includes('kamar ganti') || lowerCaseName.includes('ruang ganti')) {
                icon = '🚻';
            } else if (lowerCaseName.includes('kantin') || lowerCaseName.includes('makanan')) {
                icon = '🍔';
            } else if (lowerCaseName.includes('parkir')) {
                icon = '🅿';
            } else if (lowerCaseName.includes('shower')) {
                icon = '🚿';
            } else if (lowerCaseName.includes('locker')) {
                icon = '🔒';
            } else if (lowerCaseName.includes('wifi')) {
                icon = '📶';
            } else if (lowerCaseName.includes('ruang tunggu') || lowerCaseName.includes('area tunggu')) {
                icon = '🛋️';
            } else if (lowerCaseName.includes('dispenser') || lowerCaseName.includes('air minum')) {
                icon = '🚰';
            } 
            // Tambahkan kondisi lain sesuai fasilitas yang mungkin ada

            else { // Icon default untuk yang tidak dikenali
                icon = '✨';
            }
            processedFacilities.push({ name: name, icon: icon });
        });
    }
    // --- Akhir Perbaikan Fasilitas ---

    const operatingHours = venue.operatingHours || []; 

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Deskripsi</h3>
                <p className="text-gray-700 mb-4">{venue.description}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Alamat</h3>
                <p className="text-gray-700 mb-4">{venue.address}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Fasilitas</h3>
                <div className="grid grid-cols-3 gap-4">
                    {/* Tampilkan fasilitas hanya jika ada */}
                    {processedFacilities.length > 0 ? (
                        processedFacilities.map((fac, index) => (
                            <div key={index} className="flex flex-col items-center text-center text-gray-700">
                                <span className="text-3xl mb-1">{fac.icon}</span> 
                                <span className="text-sm">{fac.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm col-span-3">Tidak ada detail fasilitas.</p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Jam Operasional</h3>
                <ul className="mb-4">
                    {/* Tampilkan jam operasional hanya jika ada */}
                    {operatingHours.length > 0 ? (
                        operatingHours.map((op, index) => (
                            <li key={index} className="flex justify-between text-gray-700 py-1 border-b border-gray-100 last:border-b-0">
                                <span>{op.day}</span>
                                <span>{op.hours}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">Tidak ada informasi jam operasional.</p>
                    )}
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Informasi Kontak</h3>
                <p className="text-gray-700 mb-2">Instagram:
                    <a href={`https://instagram.com/${venue.contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {venue.contactInfo.instagram}
                    </a>
                </p>
                <p className="text-gray-700">Telepon:
                    <a href={`tel:${venue.contactInfo.phone}`} className="text-blue-600 hover:underline">
                        {venue.contactInfo.phone}
                    </a>
                </p>
            </div>
        </div>
    );
}

export default VenueAboutTab;