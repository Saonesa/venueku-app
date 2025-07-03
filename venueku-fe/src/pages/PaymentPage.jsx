// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(''); // 'qris', 'cash'
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Ambil detail pesanan dari state navigasi
    const { orderDetails } = location.state || {}; // Pastikan ada fallback jika state kosong

    useEffect(() => {
        // Jika tidak ada detail pesanan, arahkan kembali ke halaman jadwal
        if (!orderDetails) {
            alert('Detail pesanan tidak ditemukan. Mohon ulangi proses pemesanan.');
            navigate(-1); // Kembali ke halaman sebelumnya
        }
    }, [orderDetails, navigate]);

    if (!orderDetails) {
        return <p className="text-center py-12 text-gray-600">Memuat detail pesanan...</p>;
    }

    // Detail dari orderDetails
    const {
        venueName,
        fieldName,
        date,
        time,
        price,
        platformFee = 6000, // Contoh platform fee dummy
    } = orderDetails;

    const totalPayment = price + platformFee;

    const handleConfirmPayment = () => {
        if (!paymentMethod) {
            alert('Mohon pilih metode pembayaran.');
            return;
        }
        if (!agreedToTerms) {
            alert('Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi.');
            return;
        }

        setIsProcessing(true);
        // Simulasi proses pembayaran
        setTimeout(() => {
            alert(`Pembayaran sebesar Rp ${totalPayment.toLocaleString('id-ID')} berhasil untuk ${fieldName} via ${paymentMethod === 'qris' ? 'QRIS' : 'Cash di Lokasi'}!`);
            setIsProcessing(false);
            // Di sini Anda akan mengarahkan ke halaman riwayat pesanan atau konfirmasi sukses
            navigate('/my-orders', { state: { paymentSuccess: true, orderDetails } });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Konfirmasi Pembayaran</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kolom Kiri: Customer Detail */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Detail</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
                            <input type="text" id="customerName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="Ziong Al Balmond" />
                        </div>
                        <div>
                            <label htmlFor="customerPhone" className="block text-gray-700 text-sm font-bold mb-2">Customer Phone Number</label>
                            <input type="text" id="customerPhone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="+62 8XXXXXXXXXX" />
                        </div>
                        <div>
                            <label htmlFor="customerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" id="customerEmail" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="sufyuyayaya@gmail.com" />
                        </div>
                        <div>
                            <label htmlFor="customerCommunity" className="block text-gray-700 text-sm font-bold mb-2">Customer Profile</label>
                            <input type="text" id="customerCommunity" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Nama Komunitas, Nama Instansi, etc." />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
                            <textarea id="notes" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" placeholder="Keterangan"></textarea>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Pilihan Pembayaran Sederhana */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Jenis Pembayaran</h2>
                    <p className="text-gray-600 text-sm mb-4">Semua transaksi yang dilakukan aman dan terenkripsi.</p>

                    {/* Opsi QRIS */}
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <label className="inline-flex items-center w-full cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-blue-600"
                                name="paymentMethod"
                                value="qris"
                                checked={paymentMethod === 'qris'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="ml-3 text-gray-800 font-medium text-lg">QRIS</span>
                        </label>
                        <p className="text-gray-600 text-sm mt-2">Scan barcode QRIS untuk melakukan pembayaran.</p>
                        {paymentMethod === 'qris' && ( // Tampilkan barcode hanya jika QRIS dipilih
                            <div className="mt-4 text-center">
                                <img
                                    src="https://placehold.co/200x200/000000/FFFFFF/png?text=QRIS+Barcode" // Placeholder Barcode QRIS
                                    alt="QRIS Barcode"
                                    className="mx-auto border border-gray-300 rounded-md"
                                />
                                <p className="text-xs text-gray-500 mt-2">Scan barcode ini dengan aplikasi pembayaran Anda.</p>
                            </div>
                        )}
                    </div>

                    {/* Opsi Cash */}
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <label className="inline-flex items-center w-full cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-blue-600"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="ml-3 text-gray-800 font-medium text-lg">Cash di Lokasi</span>
                        </label>
                        <p className="text-gray-600 text-sm mt-2">Bayar langsung di lokasi venue saat Anda tiba untuk bermain.</p>
                    </div>

                </div>
            </div>

            <hr className="my-8" />

            {/* Ringkasan Pesanan & Pembayaran */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Pesanan</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">{fieldName}</span>
                    <span className="text-gray-700 font-medium">Rp {price.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{venueName} - {date} - {time}</p>

                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Harga Lapangan:</span>
                    <span className="text-gray-600 text-sm">Rp {price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Platform Fee:</span>
                    <span className="text-gray-600 text-sm">Rp {platformFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg text-gray-800 border-t pt-2 mt-2">
                    <span>Total Bayar:</span>
                    <span>Rp {totalPayment.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Venue Terms and Condition</h2>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                    <li>Reschedule hanya bisa dilakukan sebelum H-3 Jadwal Main</li>
                    <li>Dilarang merokok dalam lapangan.</li>
                    <li>Wajib menjaga kebersihan lingkungan di dalam area venue.</li>
                    {/* Tambahkan terms & conditions lain jika ada */}
                </ul>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="agreeToTerms"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-gray-700 text-sm">
                    Saya telah membaca dan menyetujui <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a> dan <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a> VenueKu, serta Syarat & Ketentuan {venueName} di atas.
                </label>
            </div>

            {/* Tombol Konfirmasi Pembayaran */}
            <button
                onClick={handleConfirmPayment}
                disabled={isProcessing || !agreedToTerms || !paymentMethod}
                className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-600 focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
                {isProcessing ? 'Memproses Pembayaran...' : 'KONFIRMASI PEMBAYARAN'}
            </button>
        </div>
    );
}

export default PaymentPage;