// src/components/AuthFormContainer.jsx
import React from 'react';
import sportImage from '../assets/ucl.png'; // Asumsikan Anda punya gambar ini

function AuthFormContainer({ children }) {
    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-160px)] items-center justify-center p-4"> {/* min-h disesuaikan agar tidak tumpang tindih footer */}
            <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 p-4">
                <img
                    src={sportImage}
                    alt="New Sports Experience"
                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                    style={{ maxHeight: '440px' }} // Batasi tinggi gambar
                />
            </div>
            <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">New Way to Book & Play</h2>
                <p className="text-gray-600 mb-6">
                    Venue Olahraga? Cukup Venueku! <a href="#" className="text-blue-600 hover:underline"></a>
                </p>
                {children}
            </div>
        </div>
    );
}

export default AuthFormContainer;