// src/pages/Admin/AdminPaymentManagementPage.jsx
import React, { useState, useEffect } from 'react';

function AdminPaymentManagementPage() {
    const [transactions, setTransactions] = useState([
        // Data dummy transaksi (tanpa bookingTime)
        { id: 'TRX001', user: 'John Doe', venue: 'City Sports Arena', field: 'Soccer Field A', date: '2023-10-26', amount: 150000, status: 'Pending' },
        { id: 'TRX002', user: 'John Doe', venue: 'City Sports Arena', field: 'Soccer Field A', date: '2023-10-26', amount: 150000, status: 'Paid' },
        { id: 'TRX003', user: 'Peter Jones', venue: 'Mega Sports Complex', field: 'Futsal Court 2', date: '2023-10-24', amount: 120000, status: 'Failed' },
        { id: 'TRX004', user: 'Jane Smith', venue: 'Green Valley Sports', field: 'Basketball Court 2', date: '2024-07-01', amount: 100000, status: 'Pending' },
    ]);

    // Hapus PAYMENT_TIMEOUT_MS dan logika useEffect yang terkait dengan timeout
    // const PAYMENT_TIMEOUT_MS = 60 * 60 * 1000; // 1 jam

    // Hapus useEffect untuk pemantauan timeout
    /*
    useEffect(() => {
      const timers = [];
      transactions.forEach(tx => {
        if (tx.status === 'Pending' && tx.bookingTime) {
          const timeElapsed = Date.now() - tx.bookingTime.getTime();
          const timeLeft = PAYMENT_TIMEOUT_MS - timeElapsed;
          if (timeLeft <= 0) {
            setTransactions(prevTransactions =>
              prevTransactions.map(t =>
                t.id === tx.id ? { ...t, status: 'Failed' } : t
              )
            );
          } else {
            const timer = setTimeout(() => {
              setTransactions(prevTransactions =>
                prevTransactions.map(t =>
                  t.id === tx.id ? { ...t, status: 'Failed' } : t
                )
              );
              alert(`Pemesanan ID ${tx.id} gagal karena pembayaran tidak dilunasi dalam 1 jam.`);
            }, timeLeft);
            timers.push(timer);
          }
        }
      });
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }, [transactions]);
    */

    const handleConfirmPayment = (id) => {
        setTransactions(transactions.map(tx =>
            tx.id === id ? { ...tx, status: 'Paid' } : tx
        ));
        alert(`Transaksi ID ${id} berhasil Dikonfirmasi (Paid)!`);
    };

    const handleUpdatePayment = (id) => {
        // Simulasi update status (misal dari Paid ke Completed)
        setTransactions(transactions.map(tx =>
            tx.id === id ? { ...tx, status: 'Completed' } : tx
        ));
        alert(`Transaksi ID ${id} berhasil Diperbarui!`);
    };

    const handleCancelPayment = (id) => {
        setTransactions(transactions.map(tx =>
            tx.id === id ? { ...tx, status: 'Cancelled' } : tx
        ));
        alert(`Transaksi ID ${id} berhasil Dibatalkan!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Management</h1>

            {/* Recent Transactions Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                {/* Kolom Venue tetap dihilangkan */}
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th> */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Field
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
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
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"> {/* Colspan tetap 7 */}
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.user}</td>
                                        {/* Data Kolom Venue tetap dihilangkan */}
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.venue}</td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.field}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IDR {tx.amount.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${tx.status === 'Paid' || tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Tombol Confirm hanya jika status Pending */}
                                            {tx.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleConfirmPayment(tx.id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {/* Tombol Update hanya jika status Paid (atau sesuai kebutuhan) */}
                                            {tx.status === 'Paid' && (
                                                <button
                                                    onClick={() => handleUpdatePayment(tx.id)}
                                                    className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 mr-2"
                                                >
                                                    Update
                                                </button>
                                            )}
                                            {/* Tombol Cancel jika status bukan Cancelled atau Failed */}
                                            {tx.status !== 'Cancelled' && tx.status !== 'Failed' && (
                                                <button
                                                    onClick={() => handleCancelPayment(tx.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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

export default AdminPaymentManagementPage;