import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import VenuekuLogo from '../../assets/venueku.svg';
import { useAuth } from '../../contexts/AuthContext';

function AdminSidebarLayout() {
    const { logout, user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogoutClick = () => {
        logout();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return <div className="text-center mt-8">Memuat Admin Panel...</div>;
    }

    const username = user?.name || 'Admin';
    const userRole = user?.role || null;

    const getNavLinkClassName = (isActive) =>
        `flex items-center p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-md transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <Link to="/admin/dashboard" className="flex items-center">
                        <img src={VenuekuLogo} alt="Venueku Logo" className="h-10 mr-2" />
                    </Link>
                    <button className="md:hidden" onClick={toggleSidebar}>
                        ❌
                    </button>
                </div>

                <nav className="flex-grow p-4 overflow-y-auto">
                    <ul>
                        {userRole === 'superadmin' ? (
                            <>
                                <li className="mb-2">
                                    <NavLink to="/admin/superadmin-dashboard" end className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-monitor">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                            <line x1="12" y1="17" x2="12" y2="21"></line>
                                            <line x1="8" y1="21" x2="16" y2="21"></line>
                                        </svg>
                                        Superadmin Dashboard
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/users" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-users">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        Users
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/partners" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-briefcase">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                        Partners
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="mb-2">
                                    <NavLink to="/admin/dashboard" end className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-home">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/venues" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-grid">
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                        Venue
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/about-admin" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-info">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        About
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/fields" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-target">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="6"></circle>
                                            <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        Fields
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/contact-payment" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-phone-call">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        Contact & Payment Info
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/gallery" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-image">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                        Gallery
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/schedule" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-calendar">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        Schedule
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/payments" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-credit-card">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                            <line x1="1" y1="10" x2="23" y2="10"></line>
                                        </svg>
                                        Payments
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <NavLink to="/admin/profile" className={({ isActive }) => getNavLinkClassName(isActive)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 feather feather-user">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        Profile
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow p-6 ml-0 md:ml- w-full">
                <header className="flex justify-between items-center mb-6">
                    <div className="md:hidden">
                        <button onClick={toggleSidebar} className="text-gray-700 text-2xl">
                            ☰
                        </button>
                    </div>
                    <div className="flex items-center ml-auto">
                        <span className="text-gray-700 font-semibold mr-4">HI, {username?.toUpperCase()}</span>
                        <img
                            src="https://placehold.co/40x40/ADD8E6/000000?text=AD"
                            alt="Admin Avatar"
                            className="w-10 h-10 rounded-full cursor-pointer mr-4"
                        />
                        <button
                            onClick={handleLogoutClick}
                            className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminSidebarLayout;
