// src/components/BroadcastYourMateSection.jsx
import React from 'react';
// import broadcastImage from '../assets/broadcast-your-mate.jpg'; // Gambar dari mockup

function BroadcastYourMateSection() {
    return (
        <section className="bg-gray-100 p-8 rounded-lg mb-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
                <img
                    src="https://via.placeholder.com/600x300?text=Broadcast+Your+Mate"
                    alt="Broadcast Your Mate"
                    className="w-full h-auto rounded-lg shadow-md"
                />
            </div>
            <div className="md:w-1/2 md:pl-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">BROADCAST YOUR MATE</h2>
                <p className="text-gray-600 mb-6">Booking foto & video untuk olahragamu sekarang.</p>
                <div className="flex justify-center md:justify-start space-x-4">
                    {/* Placeholder untuk ikon media sosial */}
                    <a href="#" className="text-gray-600 hover:text-blue-500"><i className="fab fa-instagram text-2xl"></i></a>
                    <a href="#" className="text-gray-600 hover:text-blue-500"><i className="fab fa-facebook text-2xl"></i></a>
                    <a href="#" className="text-gray-600 hover:text-blue-500"><i className="fab fa-twitter text-2xl"></i></a>
                </div>
            </div>
        </section>
    );
}

export default BroadcastYourMateSection;