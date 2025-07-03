// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Logo from '../assets/VenueKuNoBg.png'; // Asumsikan logo Anda ada di sini

function Footer() {
    const whatsappNumber = 'yourphonenumber'; // Ganti dengan nomor WhatsApp Anda, contoh: '6281234567890'

    return (
        <footer className="bg-white p-8 text-gray-600 border-t border-gray-200 mt-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Company */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">COMPANY</h4>
                    <div className="flex items-center mb-4">
                        <img src={Logo} alt="VenueKu Logo" className="h-12 mr-2" />
                        <span className="text-lg font-semibold text-gray-800"></span>
                    </div>
                    <ul>
                        <li className="mb-2"><Link to="" className="hover:text-blue-500">Home</Link></li>
                    </ul>
                </div>

                {/* Column 2: Products */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">PRODUCTS</h4>
                    <ul>
                        <li className="mb-2">
                            <Link to="/register/admin" className="hover:text-blue-500">
                                VenueKu Business
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-4">SUPPORT</h4>
                    <ul>
                        <li className="mb-2">
                            <a
                                href={`https://wa.me/${whatsappNumber}`} // <<< LINK INI DIUBAH KE WHATSAPP
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-500"
                            >
                                Help Center
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;