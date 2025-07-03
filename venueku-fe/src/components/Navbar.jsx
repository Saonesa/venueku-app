// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import VenuekuLogo from '../assets/venueku.svg'; // Pastikan path logo VenueKu Anda benar
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

function Navbar() {
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State untuk dropdown user akun

    const loginDropdownRef = useRef(null);
    const registerDropdownRef = useRef(null);
    const userDropdownRef = useRef(null); // Ref untuk dropdown user akun

    const { isLoggedIn, username, userRole, logout } = useContext(AuthContext); // Dapatkan status, username, role & fungsi dari Context

    // Fungsi untuk menutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
                setIsLoginDropdownOpen(false);
            }
            if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target)) {
                setIsRegisterDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Dependency array kosong agar hanya dijalankan sekali

    const toggleLoginDropdown = () => {
        setIsLoginDropdownOpen(prev => !prev);
        setIsRegisterDropdownOpen(false); // Tutup dropdown register jika terbuka
        setIsUserDropdownOpen(false); // Tutup dropdown user jika terbuka
    };

    const toggleRegisterDropdown = () => {
        setIsRegisterDropdownOpen(prev => !prev);
        setIsLoginDropdownOpen(false); // Tutup dropdown login jika terbuka
        setIsUserDropdownOpen(false); // Tutup dropdown user jika terbuka
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(prev => !prev);
        setIsLoginDropdownOpen(false); // Tutup dropdown login jika terbuka
        setIsRegisterDropdownOpen(false); // Tutup dropdown register jika terbuka
    };

    const handleLogout = () => {
        logout(); // Panggil fungsi logout dari Context
        setIsUserDropdownOpen(false); // Tutup dropdown setelah logout
    };

    return (
        <nav className="bg-white p-4 shadow-sm flex justify-between items-center z-50 relative">
            <div className="flex items-center">
                <Link to="/" className="flex items-center">
                    <img src={VenuekuLogo} alt="VenueKu Logo" className="h-12 mr-2" /> {/* Ukuran logo h-12 */}
                    <span className="text-xl font-semibold text-gray-800"></span>
                </Link>
            </div>

            {/* Bagian Pencarian dan Filter (Placeholder untuk MVP) */}
            <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
                <input
                    type="text"
                    placeholder="Cari venue, kota..."
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/3"
                />
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300">Filter</button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-500 font-medium">HOME</Link>
                <Link to="/venue-listing" className="text-gray-600 hover:text-blue-500 font-medium">FIELD</Link>

                {/* Ikon Keranjang/Cart (Riwayat Pesanan) */}
                <Link to="/my-orders" className="text-gray-600 hover:text-blue-500 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </Link>

                {/* Kondisi untuk menampilkan dropdown user atau tombol Login/Register */}
                {isLoggedIn && userRole !== 'anonymous' ? ( // Tampilkan dropdown user jika sudah login dan bukan anonymous
                    <div className="relative" ref={userDropdownRef}>
                        <button
                            onClick={toggleUserDropdown}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center"
                        >
                            HI, {username ? username.toUpperCase() : 'USER'} {/* Tampilkan nama pengguna */}
                            <svg className={`ml-2 h-4 w-4 transform transition-transform ${isUserDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                <Link
                                    to="/profile" // Link ke halaman profil
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    onClick={() => setIsUserDropdownOpen(false)}
                                >
                                    Akun
                                </Link>
                                <Link
                                    to="/community" // Contoh: link ke halaman komunitas
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    onClick={() => setIsUserDropdownOpen(false)}
                                >
                                    Komunitas
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Jika belum login atau user anonymous, tampilkan tombol Register dan Login dengan dropdown
                    <>
                        {/* REGISTER Button with Dropdown */}
                        <div className="relative" ref={registerDropdownRef}>
                            <button
                                onClick={toggleRegisterDropdown}
                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                REGISTER
                            </button>
                            {isRegisterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/register/user"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsRegisterDropdownOpen(false)}
                                    >
                                        Akun User
                                    </Link>
                                    <Link
                                        to="/register/admin"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsRegisterDropdownOpen(false)}
                                    >
                                        Akun Pengelola Venue
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* LOGIN Button with Dropdown */}
                        <div className="relative" ref={loginDropdownRef}>
                            <button
                                onClick={toggleLoginDropdown}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                LOGIN
                            </button>
                            {isLoginDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/login/user"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsLoginDropdownOpen(false)}
                                    >
                                        Akun User
                                    </Link>
                                    <Link
                                        to="/login/admin"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsLoginDropdownOpen(false)}
                                    >
                                        Akun Pengelola Venue
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;