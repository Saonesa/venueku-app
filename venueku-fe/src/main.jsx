// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Pastikan CSS global Anda diimpor
// Hapus import AuthProvider dari sini, karena sudah di App.jsx
// import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider sudah di App.jsx */}
    <App />
  </React.StrictMode>,
);