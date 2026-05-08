import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">Altru</div>
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-title">Main</span>
                    <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                        <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6H9.5v6H4a1 1 0 0 1-1-1v-9.5z" /></svg>
                        <span>Home</span>
                    </Link>
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Features</span>
                    <Link to="/campaigns" className={`nav-item ${isActive('/campaigns') || location.pathname.startsWith('/campaigns/') ? 'active' : ''}`}>
                        <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.33-8.28C1.2 9.62 2.52 6 5.7 5c1.85 0 3.18 1.04 4.3 2.38C11.12 6.04 12.45 5 14.3 5c3.18 0 4.5 3.62 3.03 7.72C19 16.65 12 21 12 21z" /></svg>
                        <span>Campaigns</span>
                    </Link>
                    <Link to="/fundraise" className={`nav-item ${isActive('/fundraise')}`}>
                        <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h6v10H4a1 1 0 0 1-1-1v-9zm8-6h8a2 2 0 0 1 2 2v4h-6a3 3 0 0 0-3 3v7h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm4 9h6l-2.2 7.3a1 1 0 0 1-1 .7H15a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" /></svg>
                        <span>Fundraise</span>
                    </Link>
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Account</span>
                    <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
                        <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm8.4 3.4c0-.4 0-.8-.1-1.2l2-1.5-2-3.4-2.4.9a7.9 7.9 0 0 0-2-1.2L15.6 2h-4l-.4 2.6c-.7.2-1.4.6-2 1.2l-2.4-.9-2 3.4 2 1.5c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.5 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.2 1.4-.6 2-1.2l2.4.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" /></svg>
                        <span>Settings</span>
                    </Link>
                </div>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <svg className="logout-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h8a2 2 0 0 1 2 2v3h-2V6H5v12h8v-3h2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm10.6 4.6L19 12l-3.4 3.4-1.4-1.4L15.4 13H9v-2h6.4l-1.2-1.4 1.4-1.4z" /></svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;