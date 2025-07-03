// src/pages/FieldSchedulePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../contexts/AuthContext';

// Helper function untuk mendapatkan nama hari dan tanggal
const getDayName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
};

// Helper function untuk menghasilkan slot dummy untuk satu hari
const generateDummySlots = (basePrice, isBookedAtMidday) => {
    const slots = [];
    const startHour = 8;
    const endHour = 22;
    let currentPrice = basePrice;

    for (let i = startHour; i < endHour; i++) {
        const startTime = `${String(i).padStart(2, '0')}:00`;
        const endTime = `${String(i).padStart(2, '0')}:00`; // Perbaikan: endTime harusnya i+1
        const isAvailable = !(isBookedAtMidday && i >= 10 && i <= 12);

        slots.push({
            id: `s${i}`,
            time: `${startTime} - ${endTime}`,
            price: currentPrice,
            isAvailable: isAvailable,
        });
        currentPrice += 50000;
        if (i % 3 === 0) currentPrice -= 100000;
    }
    return slots;
};


function FieldSchedulePage() {
    const { venueId, fieldId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [fieldDetails, setFieldDetails] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchFieldAndSchedule = async () => {
            setLoading(true);
            try {
                const dummyField = {
                    id: fieldId,
                    name: `ASATU Mini Soccer`,
                    venueName: `ASATU ARENA CIKINI`,
                    venueLocation: `Mini soccer in Jakarta Pusat`,
                    // GANTI URL PLACEHOLDER DENGAN YANG BERBEDA UNTUK TES
                    imageUrl: 'https://placehold.co/800x400/FF0000/FFFFFF?text=Field+Schedule+Header',
                };
                setFieldDetails(dummyField);

                const newSchedule = {};
                for (let i = 0; i < 7; i++) {
                    const date = new Date(currentDate);
                    date.setDate(currentDate.getDate() + i);
                    const dateString = date.toISOString().split('T')[0];

                    const basePrice = 1500000 + (i * 50000);
                    const isBookedAtMidday = i % 2 === 0;
                    newSchedule[dateString] = generateDummySlots(basePrice, isBookedAtMidday);
                }
                setSchedule(newSchedule);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFieldAndSchedule();
    }, [venueId, fieldId, currentDate]);

    const handleBookNow = (slot) => {
        if (!isLoggedIn) {
            alert('Anda harus login untuk melakukan pemesanan.');
            navigate('/login/user');
            return;
        }
        navigate('/payment', {
            state: {
                orderDetails: {
                    venueId: venueId,
                    fieldId: fieldId,
                    slotId: slot.id,
                    venueName: fieldDetails.venueName,
                    fieldName: fieldDetails.name,
                    date: getDayName(slot.date),
                    time: slot.time,
                    price: slot.price,
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

    if (loading) return <p className="text-center text-xl mt-8">Memuat jadwal lapangan...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
    if (!fieldDetails) return <p className="text-center text-gray-600 mt-8">Detail lapangan tidak ditemukan.</p>;

    const datesToShow = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    return (
        <div className="my-8 bg-white rounded-lg shadow-md overflow-hidden p-6">
            {/* Header Lapangan */}
            <img src={fieldDetails.imageUrl} alt={fieldDetails.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{fieldDetails.name}</h1>
            <p className="text-blue-600 text-lg mb-4">{fieldDetails.venueName} di {fieldDetails.venueLocation}</p>

            {/* Tombol Share/Social Media (Placeholder) - Sama seperti VenueDetailPage */}
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

            {/* Navigasi Tanggal */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-6">
                <button
                    onClick={getPrevWeek}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                    &lt;
                </button>
                <DatePicker
                    selected={currentDate}
                    onChange={(date) => setCurrentDate(date)}
                    dateFormat="dd MMMM yyyy" // <<< INI ADALAH FORMAT YANG BENAR UNTUK TAHUN
                    className="text-center font-semibold text-lg bg-transparent focus:outline-none"
                />
                <button
                    onClick={getNextWeek}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
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
                                    <div
                                        key={slot.id}
                                        className={`p-2 rounded-md text-sm transition-colors duration-200
                      ${slot.isAvailable
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200 opacity-70 cursor-not-allowed'
                                            }`}
                                    >
                                        <p className="font-medium text-gray-800">{slot.time}</p>
                                        <p className="text-gray-700">Rp {slot.price.toLocaleString('id-ID')}</p>
                                        <button
                                            onClick={() => handleBookNow({ ...slot, date: dateString, venueName: fieldDetails.venueName, fieldName: fieldDetails.name })}
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