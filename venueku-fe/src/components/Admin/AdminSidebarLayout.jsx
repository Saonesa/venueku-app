// src/components/Admin/AdminSidebarLayout.jsx
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import VenuekuLogo from '../../assets/venueku.svg';
import { AuthContext } from '../../contexts/AuthContext';

function AdminSidebarLayout() {
    const { logout, username, userRole } = useContext(AuthContext);

    const handleLogoutClick = () => {
        logout();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <Link to="/admin/dashboard" className="flex items-center">
                        <img src={VenuekuLogo} alt="VenueKu Logo" className="h-10 mr-2" />
                        <span className="text-2xl font-bold text-gray-800"></span>
                    </Link>
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/dashboard"
                                end
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                Home
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/about-admin"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                About
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/fields"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                Fields
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/gallery"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                Gallery
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/schedule"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                Schedule
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/payments"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                Payments
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/profile"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Profile
                            </NavLink>
                        </li>
                        {/* Tautan untuk Superadmin */}
                        {userRole === 'superadmin' && (
                            <>
                                <li className="mb-2 mt-4 border-t pt-4 border-gray-200">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Superadmin Tools</h3>
                                </li>
                                <li className="mb-2">
                                    <NavLink
                                        to="/admin/superadmin-dashboard" // <<< LINK BARU KE SUPERADMIN DASHBOARD
                                        className={({ isActive }) =>
                                            `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-monitor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="12" y1="17" x2="12" y2="21"></line><line x1="8" y1="21" x2="16" y2="21"></line></svg>
                                        Superadmin Dashboard
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink
                                        to="/admin/users"
                                        className={({ isActive }) =>
                                            `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        Users
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink
                                        to="/admin/partners"
                                        className={({ isActive }) =>
                                            `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                        Partners
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow p-6">
                <header className="flex justify-end items-center mb-6">
                    <span className="text-gray-700 font-semibold mr-4">HI, {username ? username.toUpperCase() : 'ADMIN'}</span>
                    <img
                        src="https://via.placeholder.com/40x40?text=AD"
                        alt="Admin Avatar"
                        className="w-10 h-10 rounded-full cursor-pointer mr-4"
                    />
                    <button
                        onClick={handleLogoutClick}
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Logout
                    </button>
                </header>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminSidebarLayout;