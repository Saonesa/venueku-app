// VENUEKU-FE/src/pages/FieldSchedulePage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Helper function untuk mendapatkan nama hari dan tanggal
const getDayName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
};

function FieldSchedulePage() {
    const { venueId, fieldId } = useParams(); // venueId dan fieldId dari URL
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // Dapatkan status login

    const [fieldDetails, setFieldDetails] = useState(null);
    const [schedule, setSchedule] = useState({}); // Akan menyimpan jadwal untuk SEMUA tanggal yang ditampilkan
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date()); // Tanggal awal yang dipilih (misal hari ini)

    // Menggunakan useCallback untuk fetchFieldAndSchedule agar tidak dibuat ulang setiap render
    const fetchFieldAndSchedule = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Ambil detail venue untuk mendapatkan nama venue dan lokasi
            const venueResponse = await api.get(`/venues/${venueId}`);
            const venueData = venueResponse.data;

            // 2. Cari detail field spesifik dari daftar fields di venue
            const field = venueData.fields.find(f => f.id == fieldId);
            if (!field) {
                setError('Lapangan tidak ditemukan dalam venue ini.');
                setLoading(false);
                return;
            }

            setFieldDetails({
                id: field.id,
                name: field.name,
                venueName: venueData.name,
                venueLocation: venueData.location,
                imageUrl: venueData.image_url, // PERBAIKAN: Gunakan image_url dari Venue (sesuai DB)
                price_per_hour: field.price_per_hour, // PERBAIKAN: Gunakan field.price_per_hour (sesuai DB)
                opening_time: field.opening_time,
                closing_time: field.closing_time,
            });

            // 3. Ambil jadwal ketersediaan untuk SETIAP HARI dalam seminggu
            const newSchedule = {};
            // Buat array tanggal yang akan ditampilkan (7 hari ke depan dari currentDate)
            const datesToFetch = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + i);
                return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            });

            for (const dateString of datesToFetch) {
                try {
                    // PERBAIKAN: Panggil endpoint /fields/{fieldId}/schedule
                    const scheduleResponse = await api.get(`/fields/${fieldId}/schedule?date=${dateString}`);
                    newSchedule[dateString] = scheduleResponse.data;
                } catch (dailyErr) {
                    console.warn(`Gagal mengambil jadwal untuk ${dateString}:`, dailyErr.response?.data || dailyErr.message);
                    newSchedule[dateString] = []; // Tetapkan array kosong jika gagal
                }
            }
            setSchedule(newSchedule); // Set jadwal untuk semua tanggal

        } catch (err) {
            console.error('Gagal mengambil detail venue atau jadwal lapangan secara keseluruhan:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Gagal memuat detail atau jadwal lapangan.');
        } finally {
            setLoading(false);
        }
    }, [venueId, fieldId, currentDate]); // Re-fetch jika venueId, fieldId, atau currentDate berubah

    // Effect untuk memuat detail lapangan dan jadwal saat komponen mount atau dependencies berubah
    useEffect(() => {
        fetchFieldAndSchedule();
    }, [fetchFieldAndSchedule]); // fetchFieldAndSchedule sebagai dependency

    const handleBookNow = async (slot) => {
        if (!isLoggedIn) {
            alert('Anda harus login untuk melakukan pemesanan.');
            navigate('/login/user');
            return;
        }
        if (!slot.isAvailable) {
            alert('Slot ini tidak tersedia untuk dipesan.');
            return;
        }

        // Arahkan ke halaman pembayaran dengan orderDetails
        navigate('/payment', {
            state: {
                orderDetails: {
                    venueId: venueId,
                    fieldId: fieldId,
                    slotId: slot.id, // ID slot (ini hanya dummy, tidak disimpan di DB)
                    venueName: fieldDetails.venueName,
                    fieldName: fieldDetails.name,
                    date: slot.date, // Tanggal dalam format YYYY-MM-DD
                    time: slot.time, // Waktu dalam format HH:MM - HH:MM
                    price: slot.price, // Harga per slot
                }
            }
        });
    };

    const getNextWeek = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextDate);
    };

    const getPrevWeek = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevDate);
    };

    // Array tanggal yang akan ditampilkan (digunakan untuk rendering)
    const datesToShow = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    });

    if (loading) return <p className="text-center text-xl mt-8">Memuat jadwal lapangan...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    if (!fieldDetails) return <p className="text-center text-gray-600 mt-8">Detail lapangan tidak ditemukan.</p>;

    return (
        <div className="my-8 bg-white rounded-lg shadow-md overflow-hidden p-6">
            {/* Header Lapangan */}
            <img src={fieldDetails.imageUrl} alt={fieldDetails.name}
                className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{fieldDetails.name}</h1>
            <p className="text-blue-600 text-lg mb-4">{fieldDetails.venueName} di {fieldDetails.venueLocation}</p>

            {/* Tombol Share/Social Media (Placeholder) */}
            <div className="flex space-x-3 mb-6">
                <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
                <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                </button>
                <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </button>
            </div>

            {/* Navigasi Tanggal */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-6">
                <button onClick={getPrevWeek} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    &lt;
                </button>
                <DatePicker selected={currentDate} onChange={(date) => setCurrentDate(date)} dateFormat="dd MMMM yyyy"
                    className="text-center font-semibold text-lg bg-transparent focus:outline-none"
                />
                <button onClick={getNextWeek} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    &gt;
                </button>
            </div>

            {/* Grid Jadwal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {datesToShow.map(dateString => (
                    <div key={dateString} className="border border-gray-200 rounded-lg p-3">
                        <h3 className="font-bold text-gray-800 mb-3 text-center">{getDayName(dateString)}</h3>
                        <div className="space-y-2">
                            {schedule[dateString] && schedule[dateString].length > 0 ? (
                                schedule[dateString].map(slot => (
                                    <div key={slot.id} className={`p-2 rounded-md text-sm transition-colors duration-200
                                        ${slot.isAvailable
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-red-50 border border-red-200 opacity-70 cursor-not-allowed'
                                        }`}
                                    >
                                        <p className="font-medium text-gray-800">{slot.time}</p>
                                        <p className="text-gray-700">Rp{slot.price?.toLocaleString('id-ID')}</p>
                                        <button
                                            onClick={() => handleBookNow({
                                                ...slot,
                                                date: dateString,
                                                venueName: fieldDetails.venueName,
                                                fieldName: fieldDetails.name
                                            })}
                                            disabled={!slot.isAvailable}
                                            className={`mt-2 w-full text-white px-3 py-1 rounded-md text-xs
                                                ${slot.isAvailable
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {slot.isAvailable ? 'Book Now' : 'Booked'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center text-xs">Tidak ada slot.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FieldSchedulePage;