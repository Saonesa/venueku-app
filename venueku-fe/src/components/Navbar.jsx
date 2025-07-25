// VENUEKU-FE/src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Tambahkan NavLink jika ingin styling active link
import VenuekuLogo from '../assets/venueku.svg';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // STATE BARU UNTUK MENU MOBILE

    const loginDropdownRef = useRef(null);
    const registerDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null); // Ref untuk menu mobile

    const { isLoggedIn, user, logout } = useAuth();

    const username = user?.name || null;
    const userRole = user?.role || null;

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
            // Tutup menu mobile jika klik di luar (penting)
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen) {
                // Pastikan tidak menutup jika klik tombol hamburger itu sendiri
                const hamburgerButton = document.getElementById('hamburger-button');
                if (hamburgerButton && hamburgerButton.contains(event.target)) {
                    return; // Jangan tutup jika klik tombol hamburger
                }
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]); // Tambahkan isMobileMenuOpen sebagai dependensi

    const toggleLoginDropdown = () => {
        setIsLoginDropdownOpen(prev => !prev);
        setIsRegisterDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false); // Tutup mobile menu saat dropdown lain dibuka
    };

    const toggleRegisterDropdown = () => {
        setIsRegisterDropdownOpen(prev => !prev);
        setIsLoginDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false); // Tutup mobile menu
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(prev => !prev);
        setIsLoginDropdownOpen(false);
        setIsRegisterDropdownOpen(false);
        setIsMobileMenuOpen(false); // Tutup mobile menu
    };

    const toggleMobileMenu = () => { // FUNGSI BARU UNTUK MENU MOBILE
        setIsMobileMenuOpen(prev => !prev);
        setIsLoginDropdownOpen(false); // Tutup semua dropdown lain
        setIsRegisterDropdownOpen(false);
        setIsUserDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false); // Tutup mobile menu saat logout
    };

    // Fungsi helper untuk styling NavLink (opsional, jika ingin aktif)
    const getNavLinkClassName = ({ isActive }) =>
        `text-gray-600 hover:text-blue-500 font-medium ${isActive ? 'text-blue-600' : ''}`;

    // Komponen Link Navigasi Umum (untuk reusable)
    const NavLinks = ({ onClickLink }) => (
        <>
            <NavLink to="/" className={getNavLinkClassName} onClick={onClickLink}>HOME</NavLink>
            <NavLink to="/venue-listing" className={getNavLinkClassName} onClick={onClickLink}>VENUE</NavLink>
            <NavLink to="/my-orders" className={`${getNavLinkClassName} flex items-center`} onClick={onClickLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </NavLink>
        </>
    );

    return (
        <nav className="bg-white p-4 shadow-sm flex justify-between items-center z-50 relative">
            <div className="flex items-center">
                <Link to="/" className="flex items-center">
                    <img src={VenuekuLogo} alt="Venueku Logo" className="h-12 mr-2" />
                </Link>
            </div>

            {/* Desktop Menu - Disembunyikan di Mobile */}
            <div className="hidden md:flex items-center space-x-4">
                <NavLinks /> {/* Menggunakan komponen NavLinks */}

                {isLoggedIn && userRole !== 'anonymous' ? (
                    <div className="relative" ref={userDropdownRef}>
                        <button onClick={toggleUserDropdown}
                            className={`bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center`}
                        >
                            HI, {username ? username.toUpperCase() : 'USER'}
                            <svg className={`ml-2 h-4 w-4 transform transition-transform ${isUserDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    onClick={() => setIsUserDropdownOpen(false)}>
                                    Akun
                                </Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="relative" ref={registerDropdownRef}>
                            <button onClick={toggleRegisterDropdown}
                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                REGISTER
                            </button>
                            {isRegisterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <Link to="/register/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsRegisterDropdownOpen(false)}>
                                        Akun User
                                    </Link>
                                    {/* Link Admin Register dihapus */}
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={loginDropdownRef}>
                            <button onClick={toggleLoginDropdown}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                                LOGIN
                            </button>
                            {isLoginDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <Link to="/login/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsLoginDropdownOpen(false)}>
                                        Akun User
                                    </Link>
                                    <Link to="/login/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsLoginDropdownOpen(false)}>
                                        Akun Pengelola Venue
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Hamburger Button for Mobile - Tampil di Mobile, Sembunyi di Desktop */}
            <div className="md:hidden">
                <button id="hamburger-button" onClick={toggleMobileMenu} className="text-gray-600 focus:outline-none">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu - Tampil hanya saat isMobileMenuOpen dan di Mobile */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col items-center space-y-4 md:hidden z-40">
                    <NavLinks onClickLink={toggleMobileMenu} /> {/* Menggunakan komponen NavLinks */}

                    {isLoggedIn && userRole !== 'anonymous' ? (
                        <>
                            <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-center"
                                onClick={toggleMobileMenu}>
                                Akun ({username})
                            </Link>
                            <button onClick={handleLogout} className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-center"
                                onClick={toggleMobileMenu}>
                                Register Akun User
                            </Link>
                            <Link to="/login/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-center"
                                onClick={toggleMobileMenu}>
                                Login Akun User
                            </Link>
                            <Link to="/login/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-center"
                                onClick={toggleMobileMenu}>
                                Login Pengelola Venue
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;