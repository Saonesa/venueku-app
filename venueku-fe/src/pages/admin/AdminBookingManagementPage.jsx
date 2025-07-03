// src/pages/Admin/AdminBookingManagementPage.jsx
import React, { useState, useEffect } from 'react';

function AdminBookingManagementPage() {
    const [bookings, setBookings] = useState([
        // Data dummy pemesanan
        { id: '45001', venue: 'City Sports Arena', field: 'Soccer Field 1', dateTime: '2024-07-20, 10:00 AM', user: 'John Doe', status: 'Confirmed' },
        { id: 'Y002', venue: 'Green Valley Sports', field: 'Basketball Court 2', dateTime: '2024-07-25, 02:00 PM', user: 'Jane Smith', status: 'Pending' },
        { id: 'Z003', venue: 'Mega Futsal Center', field: 'Futsal Court 3', dateTime: '2024-07-21, 08:00 PM', user: 'Alice Johnson', status: 'Confirmed' },
        { id: 'A004', venue: 'Badminton Hub', field: 'Badminton Court 1', dateTime: '2024-07-22, 09:00 AM', user: 'Bob Williams', status: 'Cancelled' },
    ]);
    const [filterField, setFilterField] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);

    useEffect(() => {
        // Simulasi fetch data dari backend (jika ada filter, ini akan memicu fetch baru)
        const fetchBookings = () => {
            let tempBookings = [...bookings];

            if (filterField) {
                tempBookings = tempBookings.filter(booking =>
                    booking.field.toLowerCase().includes(filterField.toLowerCase())
                );
            }
            if (filterStatus) {
                tempBookings = tempBookings.filter(booking =>
                    booking.status.toLowerCase() === filterStatus.toLowerCase()
                );
            }
            if (filterUser) {
                tempBookings = tempBookings.filter(booking =>
                    booking.user.toLowerCase().includes(filterUser.toLowerCase())
                );
            }
            setFilteredBookings(tempBookings);
        };

        fetchBookings();
    }, [bookings, filterField, filterStatus, filterUser]); // Re-filter saat filter atau bookings berubah

    const handleConfirm = (id) => {
        setBookings(bookings.map(booking =>
            booking.id === id ? { ...booking, status: 'Confirmed' } : booking
        ));
        alert(`Pemesanan ID ${id} berhasil Dikonfirmasi!`);
    };

    const handleCancel = (id) => {
        setBookings(bookings.map(booking =>
            booking.id === id ? { ...booking, status: 'Cancelled' } : booking
        ));
        alert(`Pemesanan ID ${id} berhasil Dibatalkan!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Management</h1>

            {/* Filter/Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    placeholder="Cari ID/Nama Lapangan"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4"
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                />
                <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter by User Name"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-1/4"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                />
                <button
                    onClick={() => { setFilterField(''); setFilterStatus(''); setFilterUser(''); }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 w-full md:w-auto"
                >
                    Clear Filters
                </button>
            </div>

            {/* All Bookings Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                {/* HAPUS KOLOM VENUE */}
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th> */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Field
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"> {/* UBAH COLSPAN DARI 7 MENJADI 6 */}
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                        {/* HAPUS DATA KOLOM VENUE */}
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.venue}</td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.field}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.dateTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {booking.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleConfirm(booking.id)}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminBookingManagementPage;