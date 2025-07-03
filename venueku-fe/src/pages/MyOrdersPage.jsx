// src/pages/MyOrdersPage.jsx
import React from 'react';

function MyOrdersPage() {
    return (
        <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Riwayat Pesanan Anda</h1> {/* Judul diubah */}
            <p className="text-gray-600">Halaman ini akan menampilkan daftar riwayat pesanan lapangan yang telah Anda lakukan.</p> {/* Deskripsi diubah */}
            {/* Di sini nanti akan ada daftar riwayat pesanan dari API */}
        </div>
    );
}

export default MyOrdersPage;