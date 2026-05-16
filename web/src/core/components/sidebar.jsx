import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', isOpen ? '300px' : '80px');
        return () => document.documentElement.style.removeProperty('--sidebar-width');
    }, [isOpen]);

    useEffect(() => {
        const pageBackgroundMap = {
            '/dashboard': '#f5f1e3',
            '/fundraise': '#f5f1e3',
            '/campaigns': '#f5f1e3',
            '/causes': '#f5f1e3',
            '/settings': '#f5f1e3',
            '/history': '#f5f1e3',
        };

        const matchKey = Object.keys(pageBackgroundMap).find((key) => location.pathname.startsWith(key));
        const pageBg = pageBackgroundMap[matchKey] || '#f5f1e3';
        document.documentElement.style.setProperty('--page-bg', pageBg);

        return () => document.documentElement.style.removeProperty('--page-bg');
    }, [location.pathname]);

    const navSections = useMemo(() => ([
        {
            title: 'Main',
            items: [
                    {
                        label: 'Home',
                    to: '/dashboard',
                    icon: 'home-sharp',
                    accent: '#ef8354',
                    isActive: location.pathname === '/dashboard',
                },
            ],
        },
        {
            title: 'Features',
            items: [
                    {
                        label: 'Campaign',
                    to: '/fundraise',
                    icon: 'trail-sign-sharp',
                    accent: '#5c8a9f',
                    isActive: location.pathname === '/fundraise',
                },
                    {
                        label: 'Causes',
                    to: '/campaigns',
                    icon: 'heart-sharp',
                    accent: '#7a93a5',
                    isActive: location.pathname.startsWith('/campaigns') || location.pathname.startsWith('/causes'),
                },
            ],
        },
        {
            title: 'Account',
            items: [
                    {
                        label: 'Settings',
                    to: '/settings',
                    icon: 'construct-sharp',
                    accent: '#5c8a9f',
                    isActive: location.pathname === '/settings',
                },
                    {
                        label: 'History',
                    to: '/history',
                    icon: 'time-sharp',
                    accent: '#b06b4a',
                    isActive: location.pathname === '/history',
                },
            ],
        },
    ]), [location.pathname]);

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
                <button
                    type="button"
                    className="menu-toggle"
                    onClick={() => setIsOpen((value) => !value)}
                    aria-label="Toggle sidebar"
                />
                <div className="brand">
                    <span className="brand-text brand-mark">Altru</span>
                </div>
            </div>

            <ul>
                {navSections.map((section) => (
                    <li key={section.title} className="section-label">
                        <span>{section.title}</span>
                        <ul>
                            {section.items.map((item) => (
                                <li
                                    key={item.label}
                                    className={`nav-item ${item.isActive ? 'active' : ''}`}
                                    style={{ '--bg': item.accent }}
                                >
                                    <Link to={item.to}>
                                        <span className="icon">
                                            <ion-icon name={item.icon} />
                                        </span>
                                        <span className="text">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="bottom">
                <button
                    type="button"
                    className="nav-item"
                    style={{ '--bg': '#2d3142' }}
                    onClick={handleLogout}
                >
                    <span className="icon">
                        <ion-icon name="log-out-sharp" />
                    </span>
                    <span className="text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;