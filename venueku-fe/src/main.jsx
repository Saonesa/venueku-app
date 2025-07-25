// VENUEKU-FE/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx'; 
import { BrowserRouter as Router } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* <<< BrowserRouter harus membungkus seluruh aplikasi yang menggunakan routing */}
      <AuthProvider> {/* <<< AuthProvider membungkus App */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);