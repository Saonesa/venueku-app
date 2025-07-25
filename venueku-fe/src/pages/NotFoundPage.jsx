import React from 'react';

function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-lg text-gray-600">Maaf, halaman yang Anda cari tidak ada. Silakan periksa URL atau kembali ke halaman utama.</p>
      <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Kembali ke Beranda</a>
    </div>
  );
}

export default NotFoundPage;