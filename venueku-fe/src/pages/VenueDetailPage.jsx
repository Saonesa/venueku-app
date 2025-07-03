// src/pages/VenueDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useLocation } from 'react-router-dom'; // Import NavLink dan Outlet

function VenueDetailPage() {
    const { id } = useParams(); // Mengambil ID venue dari URL
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Untuk menentukan tab aktif

    useEffect(() => {
        // --- Simulasi Fetch Data Detail Venue (Ganti dengan API Sahrul nanti) ---
        const fetchVenueDetails = async () => {
            setLoading(true);
            try {
                // Data dummy untuk pengembangan awal
                const dummyVenueData = {
                    id: id, // Pastikan ID sesuai dengan yang diterima dari useParams
                    name: `ASATU ARENA CIKINI`,
                    location: 'Mini soccer in Jakarta Pusat',
                    imageUrl: 'https://via.placeholder.com/1000x400?text=Venue+Header', // Gambar utama venue
                    description: 'Lapangan mini soccer yang berlokasi di Permata Hijau, Jakarta Selatan. Lapangan ini sangat cocok untuk bermain sepak bola dengan teman-teman atau keluarga. Fasilitas lengkap dan nyaman.',
                    address: 'Jl. Legam no 7, RT.1/RW.8, Grogol Utara, Kebayoran Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12210',
                    facilities: [
                        { name: 'Shower', icon: '🚿' }, // Placeholder ikon
                        { name: 'Parkir', icon: '🅿️' },
                        { name: 'Kantin', icon: '🍔' },
                        { name: 'Locker', icon: '🔒' },
                        { name: 'Mushola', icon: '🕌' },
                    ],
                    operatingHours: [
                        { day: 'Senin', hours: '08:00 - 22:00' },
                        { day: 'Selasa', hours: '08:00 - 22:00' },
                        { day: 'Rabu', hours: '08:00 - 22:00' },
                        { day: 'Kamis', hours: '08:00 - 22:00' },
                        { day: 'Jumat', hours: '08:00 - 22:00' },
                        { day: 'Sabtu', hours: '08:00 - 23:00' },
                        { day: 'Minggu', hours: '08:00 - 23:00' },
                    ],
                    contactInfo: {
                        instagram: '@venueku_official',
                        phone: '+6281234567890',
                    },
                    fields: [ // Daftar lapangan spesifik di dalam venue ini
                        { id: 'f1', name: 'ASATU Mini Soccer', type: 'Mini Soccer', price: 275000, imageUrl: 'https://via.placeholder.com/300x200?text=Field+1' },
                        { id: 'f2', name: 'ASATU Futsal', type: 'Futsal', price: 200000, imageUrl: 'https://via.placeholder.com/300x200?text=Field+2' },
                    ],
                    galleryImages: [
                        'https://via.placeholder.com/800x600?text=Gallery+1',
                        'https://via.placeholder.com/800x600?text=Gallery+2',
                        'https://via.placeholder.com/800x600?text=Gallery+3',
                    ]
                };
                setVenue(dummyVenueData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVenueDetails();
    }, [id]); // Re-fetch jika ID venue berubah

    if (loading) return <p className="text-center text-xl mt-8">Memuat detail venue...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    if (!venue) return <p className="text-center text-gray-600 mt-8">Venue tidak ditemukan.</p>;

    // Menentukan tab aktif berdasarkan URL saat ini
    const getTabClassName = (tabName) => {
        return `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
      ${location.pathname.endsWith(tabName)
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`;
    };

    return (
        <div className="my-8 bg-white rounded-lg shadow-md overflow-hidden"> {/* <<< HAPUS "container mx-auto p-4" DARI SINI */}
            {/* Gambar Utama Venue */}
            <img src={venue.imageUrl} alt={venue.name} className="w-full h-96 object-cover" />

            <div className="p-6">
                {/* Nama Venue & Lokasi */}
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{venue.name}</h1>
                <p className="text-blue-600 text-lg mb-4">{venue.location}</p>

                {/* Tombol Share/Social Media (Placeholder) */}
                <div className="flex space-x-3 mb-6">
                    <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </button>
                    <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </button>
                </div>

                {/* Navigasi Tab */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <NavLink
                            to="field" // Path relatif ke rute induk
                            className={({ isActive }) => getTabClassName('field')}
                            end // Penting untuk NavLink agar aktif hanya jika path persis cocok
                        >
                            Field Detail
                        </NavLink>
                        <NavLink
                            to="about" // Path relatif ke rute induk
                            className={({ isActive }) => getTabClassName('about')}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="gallery" // Path relatif ke rute induk
                            className={({ isActive }) => getTabClassName('gallery')}
                        >
                            Gallery
                        </NavLink>
                    </nav>
                </div>

                {/* Konten Tab Dirender di sini oleh Outlet */}
                <Outlet context={{ venue }} /> {/* Meneruskan data venue ke komponen anak */}
            </div>
        </div>
    );
}

export default VenueDetailPage;