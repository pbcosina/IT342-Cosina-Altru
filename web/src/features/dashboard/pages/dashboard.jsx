import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import Sidebar from '../../../core/components/sidebar';
import { dashboardApi } from '../../../core/services/apiService';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
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

    return (
        <div className="dashboard-layout">
            <Sidebar />

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
                        {loading && <p className="stat-card-sub">Loading activity...</p>}
                        {!loading && summary?.recentActivity?.length > 0 && (
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
                        )}
                        {!loading && !summary?.recentActivity?.length && (
                            <p className="stat-card-sub">No recent activity yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;