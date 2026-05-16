import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import Sidebar from '../../../core/components/sidebar';
import NotificationBell from '../../../core/components/notificationBell';
import { campaignsApi, dashboardApi } from '../../../core/services/apiService';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isNewUser, setIsNewUser] = useState(() => localStorage.getItem('isNewUser') === 'true');

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const formatCurrency = (value) => `₱${Number(value ?? 0).toLocaleString()}`;

    const userInitials = useMemo(() => {
        const name = user?.name || 'User';
        const parts = name.trim().split(' ').filter(Boolean);
        if (!parts.length) return 'U';
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
        return `${first}${last}`.toUpperCase() || 'U';
    }, [user?.name]);

    const normalizeStatus = (status, campaign) => {
        if (campaign?.donationGoal && campaign?.currentDonation && Number(campaign.currentDonation) >= Number(campaign.donationGoal)) {
            return { label: 'Goal Reached', className: 'goal-reached' };
        }
        if (!status) return { label: 'Draft', className: 'draft' };
        const normalized = status.toUpperCase();
        if (normalized === 'PUBLISHED') return { label: 'Active', className: 'active' };
        if (normalized === 'COMPLETED') return { label: 'Completed', className: 'completed' };
        if (normalized === 'DRAFT') return { label: 'Draft', className: 'draft' };
        return { label: status, className: status.toLowerCase().replace(/\s+/g, '-') };
    };


    const filteredCampaigns = useMemo(() => myCampaigns, [myCampaigns]);

    const topCampaign = useMemo(() => {
        if (!myCampaigns.length) return null;
        return myCampaigns.reduce((top, current) => (current.currentDonation > top.currentDonation ? current : top), myCampaigns[0]);
    }, [myCampaigns]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const results = await Promise.allSettled([
                    dashboardApi.summary(),
                    campaignsApi.my({ page: 0, size: 20, sortBy: 'updatedAt', sortDirection: 'DESC' }),
                    campaignsApi.list({ page: 0, size: 6, sortBy: 'createdAt', sortDirection: 'DESC' }),
                ]);

                const [summaryResult, campaignsResult, recommendedResult] = results;

                if (summaryResult.status === 'fulfilled') {
                    setSummary(summaryResult.value);
                    setError('');
                } else {
                    setError(summaryResult.reason?.message || 'Failed to load dashboard summary.');
                }

                if (campaignsResult.status === 'fulfilled') {
                    setMyCampaigns(campaignsResult.value);
                }

                if (recommendedResult.status === 'fulfilled') {
                    const rankedRecommendations = (recommendedResult.value || [])
                        .sort((a, b) => Number(b.donationCount ?? 0) - Number(a.donationCount ?? 0))
                        .slice(0, 3);
                    setRecommendedCampaigns(rankedRecommendations);
                }
            } catch (err) {
                setError(err.message || 'Failed to load dashboard summary.');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    useEffect(() => {
        if (isNewUser) {
            localStorage.setItem('isNewUser', 'false');
        }
    }, [isNewUser]);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">
                <header className="top-header">
                    <div className="header-left" />
                    <div className="header-right">
                        <NotificationBell />
                        <div className="user-profile">
                            <span>{user?.name || 'User'}</span>
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user?.name || 'User'} className="user-avatar" />
                            ) : (
                                <div className="user-avatar-placeholder" aria-hidden="true">{userInitials}</div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="content-body">
                    <div className="dashboard-welcome">
                        <h1>{isNewUser ? `${greeting}, ${user?.name || 'friend'}!` : `${greeting}, ${user?.name || 'friend'}!`}</h1>
                        <p>{isNewUser ? 'Start your first campaign or support a cause that matters to you.' : 'Explore causes, track your impact, and grow your campaigns.'}</p>
                    </div>

                    {error && <p className="donation-msg error" style={{ marginBottom: '1rem' }}>{error}</p>}

                    <div className="quick-stats">
                        <div className="stat-card">
                            <span className="stat-card-label">Donations Received</span>
                            {loading ? (
                                <div className="skeleton-block">
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            ) : (
                                <>
                                    <span className="stat-card-value">{summary?.totalDonationsReceived ?? 0}</span>
                                    <span className="stat-card-sub">Across your campaigns</span>
                                </>
                            )}
                        </div>
                        <div className="stat-card">
                            <span className="stat-card-label">Active Campaigns</span>
                            {loading ? (
                                <div className="skeleton-block">
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            ) : (
                                <>
                                    <span className="stat-card-value">{summary?.activeCampaigns ?? 0}</span>
                                    <span className="stat-card-sub">Currently published</span>
                                </>
                            )}
                        </div>
                        <div className="stat-card">
                            <span className="stat-card-label">Total Amount Raised</span>
                            {loading ? (
                                <div className="skeleton-block">
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            ) : (
                                <>
                                    <span className="stat-card-value">{formatCurrency(summary?.totalAmountRaised ?? 0)}</span>
                                    <span className="stat-card-sub">From all donations</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="section-grid">
                        <section className="stat-card impact-summary">
                            <div className="section-heading">Impact Summary</div>
                            <div className="impact-grid">
                                <div className="impact-item">
                                    <span className="impact-label">Beneficiaries Helped</span>
                                    <span className="impact-value">{myCampaigns.reduce((sum, campaign) => sum + Number(campaign.donationCount ?? 0), 0)}</span>
                                </div>
                                <div className="impact-item">
                                    <span className="impact-label">Campaigns Created</span>
                                    <span className="impact-value">{myCampaigns.length}</span>
                                </div>
                                <div className="impact-item">
                                    <span className="impact-label">Donations Received</span>
                                    <span className="impact-value">{summary?.totalDonationsReceived ?? 0}</span>
                                </div>
                                <div className="impact-item">
                                    <span className="impact-label">Amount Raised</span>
                                    <span className="impact-value">{formatCurrency(summary?.totalAmountRaised ?? 0)}</span>
                                </div>
                            </div>
                        </section>

                        <section className="stat-card top-campaign-card">
                            <div className="section-heading">Your Top Campaign</div>
                            <span className="stat-card-sub" style={{ marginTop: '-0.6rem' }}>From your campaign list</span>
                            {topCampaign ? (
                                <>
                                    <div className="top-campaign-body">
                                        <div>
                                            <div className="top-campaign-title">{topCampaign.title}</div>
                                            <div className={`status-badge status-${normalizeStatus(topCampaign.status, topCampaign).className}`}>
                                                {normalizeStatus(topCampaign.status, topCampaign).label}
                                            </div>
                                        </div>
                                        <div className="top-campaign-stats">
                                            <div>
                                                <span className="impact-label">Raised</span>
                                                <span className="impact-value">{formatCurrency(topCampaign.currentDonation)}</span>
                                            </div>
                                            <div>
                                                <span className="impact-label">Supporters</span>
                                                <span className="impact-value">{topCampaign.donationCount ?? 0}</span>
                                            </div>
                                            <div>
                                                <span className="impact-label">Progress</span>
                                                <span className="impact-value">{Math.min(100, Math.round((Number(topCampaign.currentDonation) / Number(topCampaign.donationGoal || 1)) * 100))}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-row">
                                        <div className="progress-meta">
                                            <span>{formatCurrency(topCampaign.currentDonation)} raised of {formatCurrency(topCampaign.donationGoal)}</span>
                                            <span>{Math.min(100, Math.round((Number(topCampaign.currentDonation) / Number(topCampaign.donationGoal || 1)) * 100))}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((Number(topCampaign.currentDonation) / Number(topCampaign.donationGoal || 1)) * 100))}%` }} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon" aria-hidden="true">🏁</div>
                                    <div>
                                        <div className="empty-title">No campaigns yet</div>
                                        <div className="stat-card-sub">Launch a campaign to see your top performance.</div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    <section className="stat-card campaigns-section">
                        <div className="section-heading">Campaign Progress</div>
                        <div className="section-subhead">
                            <span className="stat-card-sub">Track how your campaigns are performing.</span>
                            <button className="quick-action-btn quick-action-primary" onClick={() => navigate('/fundraise')} type="button">
                                Start a Campaign
                            </button>
                        </div>
                        {loading ? (
                            <div className="campaigns-skeleton">
                                <div className="skeleton-card" />
                                <div className="skeleton-card" />
                                <div className="skeleton-card" />
                            </div>
                        ) : (
                            <div className="campaigns-grid">
                                {filteredCampaigns.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon" aria-hidden="true">🌱</div>
                                        <div>
                                            <div className="empty-title">No matching campaigns yet</div>
                                            <div className="stat-card-sub">Start your first campaign and begin making an impact.</div>
                                        </div>
                                    </div>
                                ) : (
                                    filteredCampaigns.map((campaign) => {
                                        const percent = Math.min(100, Math.round((Number(campaign.currentDonation) / Number(campaign.donationGoal || 1)) * 100));
                                        const statusBadge = normalizeStatus(campaign.status, campaign);
                                        return (
                                            <div className="campaign-card" key={campaign.id}>
                                                <div className="campaign-header">
                                                    <div>
                                                        <div className="campaign-title">{campaign.title}</div>
                                                        <div className="campaign-meta">{campaign.category}</div>
                                                    </div>
                                                    <span className={`status-badge status-${statusBadge.className}`}>{statusBadge.label}</span>
                                                </div>
                                                <div className="progress-row">
                                                    <div className="progress-meta">
                                                        <span>{formatCurrency(campaign.currentDonation)} raised of {formatCurrency(campaign.donationGoal)}</span>
                                                        <span>{percent}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                                <div className="campaign-footer">
                                                    <span className="stat-card-sub">{campaign.donationCount ?? 0} supporters</span>
                                                    {Number(campaign.daysRemaining ?? 0) > 0 ? (
                                                        <span className="stat-card-sub">{campaign.daysRemaining} days left</span>
                                                    ) : (
                                                        <span className="stat-card-sub">No deadline set</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </section>

                    <section className="stat-card recommended-section">
                        <div className="section-heading">Recommended Causes</div>
                        <div className="section-subhead">
                            <span className="stat-card-sub">Support causes that match your interests.</span>
                            <button className="quick-action-btn quick-action-secondary" onClick={() => navigate('/campaigns')} type="button">
                                Browse Causes
                            </button>
                        </div>
                        {loading ? (
                            <div className="campaigns-skeleton">
                                <div className="skeleton-card" />
                                <div className="skeleton-card" />
                                <div className="skeleton-card" />
                            </div>
                        ) : recommendedCampaigns.length ? (
                            <div className="recommendation-grid">
                                {recommendedCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="recommendation-card">
                                        <div>
                                            <div className="campaign-title">{campaign.title}</div>
                                            <div className="campaign-meta">{campaign.category}</div>
                                        </div>
                                        <div className="recommendation-footer">
                                            <span>{formatCurrency(campaign.currentDonation)} raised</span>
                                            <span>{campaign.donationCount ?? 0} supporters</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon" aria-hidden="true">✨</div>
                                <div>
                                    <div className="empty-title">No recommendations yet</div>
                                    <div className="stat-card-sub">Check back soon for causes tailored to your activity.</div>
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;