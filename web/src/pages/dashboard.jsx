import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { dashboardApi } from '../services/apiService';
import './dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await dashboardApi.summary();
                setSummary(data);
                setError('');
            } catch (err) {
                setError(err.message || 'Failed to load dashboard summary.');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">Altru</div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Main</span>
                        <Link to="/dashboard" className="nav-item active">
                            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6H9.5v6H4a1 1 0 0 1-1-1v-9.5z" />
                            </svg>
                            <span>Home</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <span className="nav-section-title">Features</span>
                        <Link to="/campaigns" className="nav-item">
                            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 21s-7-4.35-9.33-8.28C1.2 9.62 2.52 6 5.7 5c1.85 0 3.18 1.04 4.3 2.38C11.12 6.04 12.45 5 14.3 5c3.18 0 4.5 3.62 3.03 7.72C19 16.65 12 21 12 21z" />
                            </svg>
                            <span>Campaigns</span>
                        </Link>
                        <Link to="/fundraise" className="nav-item">
                            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 10h6v10H4a1 1 0 0 1-1-1v-9zm8-6h8a2 2 0 0 1 2 2v4h-6a3 3 0 0 0-3 3v7h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm4 9h6l-2.2 7.3a1 1 0 0 1-1 .7H15a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
                            </svg>
                            <span>Fundraise</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <span className="nav-section-title">Account</span>
                        <Link to="/settings" className="nav-item">
                            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm8.4 3.4c0-.4 0-.8-.1-1.2l2-1.5-2-3.4-2.4.9a7.9 7.9 0 0 0-2-1.2L15.6 2h-4l-.4 2.6c-.7.2-1.4.6-2 1.2l-2.4-.9-2 3.4 2 1.5c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.5 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.2 1.4-.6 2-1.2l2.4.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
                            </svg>
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg className="logout-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 4h8a2 2 0 0 1 2 2v3h-2V6H5v12h8v-3h2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm10.6 4.6L19 12l-3.4 3.4-1.4-1.4L15.4 13H9v-2h6.4l-1.2-1.4 1.4-1.4z" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" />
                    </div>
                </header>

                <div className="content-body">
                    <div className="dashboard-welcome">
                        <h1>Welcome back, {user?.name}!</h1>
                        <p>Explore causes, track your impact, and grow your campaigns.</p>
                    </div>

                    <div className="quick-actions" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <button className="quick-action-btn quick-action-primary" onClick={() => navigate('/fundraise')} type="button">Create Campaign</button>
                        <button className="quick-action-btn quick-action-secondary" onClick={() => navigate('/campaigns')} type="button">Browse Causes</button>
                    </div>

                    {error && <p className="donation-msg error" style={{ marginBottom: '1rem' }}>{error}</p>}

                    <div className="search-container">
                        <div className="search-bar-wrapper">
                            <div className="search-icon-box" aria-hidden="true">
                                <svg className="search-icon" viewBox="0 0 24 24" focusable="false">
                                    <path d="M11 3a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 11 3zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by title of cause..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="quick-stats">
                        <div className="stat-card">
                            <span className="stat-card-label">Donations Received</span>
                            <span className="stat-card-value">{loading ? '...' : (summary?.totalDonationsReceived ?? 0)}</span>
                            <span className="stat-card-sub">Across your campaigns</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-card-label">Active Campaigns</span>
                            <span className="stat-card-value">{loading ? '...' : (summary?.activeCampaigns ?? 0)}</span>
                            <span className="stat-card-sub">Currently published</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-card-label">Total Amount Raised</span>
                            <span className="stat-card-value">{loading ? '...' : `₱${Number(summary?.totalAmountRaised ?? 0).toLocaleString()}`}</span>
                            <span className="stat-card-sub">From all donations</span>
                        </div>
                    </div>

                    <div className="stat-card" style={{ marginTop: '1rem' }}>
                        <span className="stat-card-label">Recent Activity</span>
                        {loading ? (
                            <p className="stat-card-sub">Loading activity...</p>
                        ) : summary?.recentActivity?.length ? (
                            <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.75rem' }}>
                                {summary.recentActivity.map((item, idx) => (
                                    <div key={`${item.type}-${item.createdAt}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                                            <div className="stat-card-sub">{item.subtitle}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {item.amount != null && <div style={{ fontWeight: 600 }}>₱{Number(item.amount).toLocaleString()}</div>}
                                            <div className="stat-card-sub">{new Date(item.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="stat-card-sub">No recent activity yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;