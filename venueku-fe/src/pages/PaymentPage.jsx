// VENUEKU-FE/src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { getCookie } from '../utils/cookies';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notes, setNotes] = useState('');
    const [qrisImageUrl, setQrisImageUrl] = useState(null);

    // State untuk informasi pelanggan
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');

    const { orderDetails } = location.state || {};

    useEffect(() => {
        if (!orderDetails || !isLoggedIn || !user) {
            alert('Detail pesanan tidak ditemukan atau Anda belum login. Mohon ulangi proses pemesanan.');
            navigate(-1);
            return;
        }

        // Set informasi pelanggan dari user yang login
        setCustomerName(user?.name || '');
        setCustomerPhone(user?.phone_number || '');
        setCustomerEmail(user?.email || '');

        if (orderDetails.qrisImageUrl) {
            setQrisImageUrl(orderDetails.qrisImageUrl);
        } else if (orderDetails.venueId) {
            const fetchVenueQris = async () => {
                try {
                    const response = await api.get(`/venues/${orderDetails.venueId}`);
                    setQrisImageUrl(response.data.qris_image_url);
                } catch (error) {
                    console.error("Failed to fetch QRIS image for venue:", error);
                    setQrisImageUrl(null);
                }
            };
            fetchVenueQris();
        } else {
            setQrisImageUrl(null);
        }

        setNotes(orderDetails.notes || '');
    }, [orderDetails, isLoggedIn, navigate, user]);

    if (!orderDetails || !user) {
        return <p className="text-center py-12 text-gray-600">Memuat detail pesanan...</p>;
    }

    const {
        venueId,
        fieldId,
        date,
        time,
        price,
        venueName,
        fieldName,
    } = orderDetails;

    const platformFee = 6000;
    const totalPayment = price + platformFee;

    const handleConfirmPayment = async () => {
        if (!paymentMethod) {
            alert('Mohon pilih metode pembayaran.');
            return;
        }
        if (!agreedToTerms) {
            alert('Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi.');
            return;
        }

        setIsProcessing(true);
        try {
            await axios.get(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + '/sanctum/csrf-cookie', { withCredentials: true });
            const csrfToken = getCookie('XSRF-TOKEN');

            const bookingData = {
                venueId,
                fieldId,
                date,
                time,
                price,
                paymentMethod,
                notes,
            };

            const response = await api.post('/bookings', bookingData, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                }
            });

            alert(`Pembayaran sebesar Rp ${totalPayment.toLocaleString('id-ID')} berhasil untuk ${fieldName} via ${paymentMethod === 'qris' ? 'QRIS' : 'Cash di Lokasi'}! Pesanan Anda telah dibuat.`);
            navigate('/my-orders', { state: { paymentSuccess: true, bookingId: response.data.booking.id } });
        } catch (err) {
            console.error('Gagal melakukan pembayaran/booking:', err.response?.data || err.message);
            alert(`Gagal melakukan pembayaran: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Konfirmasi Pembayaran</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Detail */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Detail</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
                            <input type="text" id="customerName" value={customerName} readOnly
                                className="bg-gray-100 cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 shadow" />
                        </div>
                        {customerPhone && (
                            <div>
                                <label htmlFor="customerPhone" className="block text-gray-700 text-sm font-bold mb-2">Customer Phone Number</label>
                                <input type="text" id="customerPhone" value={customerPhone} readOnly
                                    className="bg-gray-100 cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 shadow" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="customerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" id="customerEmail" value={customerEmail} readOnly
                                className="bg-gray-100 cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 shadow" />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
                            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                                className="border rounded w-full py-2 px-3 text-gray-700 shadow h-24"
                                placeholder="Keterangan tambahan untuk pemesanan (opsional)" />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Jenis Pembayaran</h2>
                    <p className="text-gray-600 text-sm mb-4">Semua transaksi yang dilakukan aman dan terenkripsi.</p>

                    {/* QRIS */}
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <label className="inline-flex items-center w-full cursor-pointer">
                            <input type="radio" className="form-radio h-5 w-5 text-blue-600" name="paymentMethod" value="qris"
                                checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <span className="ml-3 text-gray-800 font-medium text-lg">QRIS</span>
                        </label>
                        <p className="text-gray-600 text-sm mt-2">Scan barcode QRIS untuk melakukan pembayaran.</p>
                        {paymentMethod === 'qris' && qrisImageUrl && (
                            <div className="mt-4 text-center">
                                <img src={qrisImageUrl} alt="QRIS Barcode" className="mx-auto border border-gray-300 rounded-md" />
                                <p className="text-xs text-gray-500 mt-2">Scan barcode ini dengan aplikasi pembayaran Anda.</p>
                            </div>
                        )}
                        {paymentMethod === 'qris' && !qrisImageUrl && (
                            <p className="text-xs text-gray-500 mt-2">Gambar QRIS tidak tersedia untuk venue ini.</p>
                        )}
                    </div>

                    {/* Cash */}
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <label className="inline-flex items-center w-full cursor-pointer">
                            <input type="radio" className="form-radio h-5 w-5 text-blue-600" name="paymentMethod" value="cash"
                                checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <span className="ml-3 text-gray-800 font-medium text-lg">Cash di Lokasi</span>
                        </label>
                        <p className="text-gray-600 text-sm mt-2">Bayar langsung di lokasi venue saat Anda tiba untuk bermain.</p>
                    </div>
                </div>
            </div>

            <hr className="my-8" />

            {/* Ringkasan Pembayaran */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Pesanan</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">{fieldName}</span>
                    <span className="text-gray-700 font-medium">Rp {price?.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{venueName} - {date} - {time}</p>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Harga Lapangan:</span>
                    <span>Rp {price?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Platform Fee:</span>
                    <span>Rp {platformFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg text-gray-800 border-t pt-2 mt-2">
                    <span>Total Bayar:</span>
                    <span>Rp {totalPayment.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="flex items-center mb-6">
                <input type="checkbox" id="agreeToTerms" className="form-checkbox h-5 w-5 text-blue-600"
                    checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                <label htmlFor="agreeToTerms" className="ml-2 text-gray-700 text-sm">
                    Saya telah membaca dan menyetujui <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a> dan <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a> VenueKu, serta Syarat & Ketentuan {venueName} di atas.
                </label>
            </div>

            <button
                onClick={handleConfirmPayment}
                disabled={isProcessing || !agreedToTerms || !paymentMethod}
                className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-600 focus:outline-none disabled:opacity-50"
            >
                {isProcessing ? 'Memproses Pembayaran...' : 'KONFIRMASI PEMBAYARAN'}
            </button>
        </div>
    );
}

export default PaymentPage;
