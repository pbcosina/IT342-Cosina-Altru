import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookmarksApi, campaignsApi } from '../services/apiService';
import Sidebar from '../components/sidebar';
import './causes.css';

const CATEGORIES = [
    'Health',
    'Education',
    'disaster',
    'community development',
    'children/youth',
    'environment',
    'animal welfare',
    'sports/recreation',
    'memorial/funeral',
    'others: state',
];

const Causes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortMode, setSortMode] = useState('NEWEST');
    const [bookmarks, setBookmarks] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const getSortParams = useCallback(() => {
        if (sortMode === 'MOST_FUNDED') {
            return { sortBy: 'currentDonation', sortDirection: 'DESC' };
        }
        if (sortMode === 'ENDING_SOON') {
            return { sortBy: 'endDate', sortDirection: 'ASC' };
        }
        return { sortBy: 'createdAt', sortDirection: 'DESC' };
    }, [sortMode]);

    const fetchCauses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await campaignsApi.list({
                search: searchQuery || undefined,
                category: selectedCategory || undefined,
                ...getSortParams(),
            });
            setCampaigns(data);
            setMessage('');
        } catch (error) {
            setMessage(error.message || 'Failed to fetch campaigns.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, getSortParams]);

    const fetchBookmarks = useCallback(async () => {
        try {
            const saved = await bookmarksApi.list();
            setBookmarks(new Set(saved.map(item => item.id)));
        } catch (error) {
            console.error('Failed to load bookmarks', error);
        }
    }, []);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    useEffect(() => {
        fetchCauses();
    }, [fetchCauses]);

    const toggleBookmark = async (campaignId) => {
        try {
            if (bookmarks.has(campaignId)) {
                await bookmarksApi.remove(campaignId);
                setBookmarks(prev => {
                    const next = new Set(prev);
                    next.delete(campaignId);
                    return next;
                });
            } else {
                await bookmarksApi.add(campaignId);
                setBookmarks(prev => new Set(prev).add(campaignId));
            }
        } catch (error) {
            setMessage(error.message || 'Failed to update bookmark.');
        }
    };

    return (
        <div className="causes-layout">
            <Sidebar />
            <main className="main-content causes-main">
                <header className="top-header">
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" title={user?.name} />
                    </div>
                </header>

                <div className="content-body">
                    {/* Hero */}
                    <div className="causes-page-hero">
                        <h1>Browse Campaigns</h1>
                        <p>Find something worth supporting — every peso counts.</p>
                    </div>

                    {/* Search + Filter */}
                    <div className="search-container">
                        <div className="search-bar-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#b09080' }}>
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="category-filter-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            className="category-filter-select"
                            value={sortMode}
                            onChange={(e) => setSortMode(e.target.value)}
                        >
                            <option value="NEWEST">Newest</option>
                            <option value="MOST_FUNDED">Most Funded</option>
                            <option value="ENDING_SOON">Ending Soon</option>
                        </select>
                    </div>

                    {message && <p className="donation-msg error">{message}</p>}

                    {/* Result summary */}
                    <p className="results-count">
                        {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} found
                        {selectedCategory && <> in <em>{selectedCategory}</em></>}
                    </p>

                    {/* Grid */}
                    <div className="causes-grid">
                        {loading ? (
                            <p className="no-causes-msg"><strong>Loading campaigns...</strong></p>
                        ) : campaigns.length === 0 ? (
                            <p className="no-causes-msg">
                                <strong>Nothing here yet.</strong>{' '}
                                Try adjusting your search or filter.
                            </p>
                        ) : (
                            campaigns.map(campaign => (
                                <div className="cause-card" key={campaign.id}>
                                    <div className="cause-image-wrapper">
                                        <div
                                            className="cause-image"
                                            style={{ backgroundImage: `url(${campaign.imageUrl || 'https://images.unsplash.com/photo-1594750018092-36b0e3dd95de?w=600&auto=format&fit=crop'})` }}
                                        />
                                        {campaign.category && (
                                            <span className="cause-category-pill">
                                                {campaign.category}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => toggleBookmark(campaign.id)}
                                            aria-label={bookmarks.has(campaign.id) ? 'Remove bookmark' : 'Save campaign'}
                                            title={bookmarks.has(campaign.id) ? 'Remove bookmark' : 'Save campaign'}
                                            style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', border: 'none', borderRadius: '999px', background: '#fff', width: '34px', height: '34px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(45,49,66,0.18)' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarks.has(campaign.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: '#2d3142' }}>
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="cause-info">
                                        <h3 className="cause-title">{campaign.title}</h3>
                                        <p className="cause-snippet">
                                            {campaign.story ? campaign.story.substring(0, 90) + '…' : 'No description provided.'}
                                        </p>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ height: '8px', width: '100%', background: '#e7e7e7', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(100, (Number(campaign.currentDonation || 0) / Math.max(Number(campaign.donationGoal || 1), 1)) * 100)}%`, height: '100%', background: '#9fb1bc' }} />
                                            </div>
                                            <p className="cause-author" style={{ marginTop: '0.35rem' }}>
                                                                        {campaign.daysRemaining ?? 0} days left
                                            </p>
                                        </div>
                                        <div className="cause-card-footer">
                                            <p className="cause-author">{campaign.authorName || 'Anonymous'}</p>
                                            <button
                                                type="button"
                                                className="cause-read-more"
                                                onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                                            >
                                                <span>View</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Causes;