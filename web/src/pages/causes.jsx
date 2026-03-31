import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { campaignsApi } from '../services/apiService';
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

    const fetchCauses = useCallback(async () => {
        try {
            const data = await campaignsApi.list({
                search: searchQuery || undefined,
                category: selectedCategory || undefined,
            });
            setCampaigns(data);
        } catch (error) {
            console.error('Failed to fetch campaigns', error);
        }
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchCauses();
    }, [fetchCauses]);

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
                    </div>

                    {/* Result summary */}
                    <p className="results-count">
                        {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} found
                        {selectedCategory && <> in <em>{selectedCategory}</em></>}
                    </p>

                    {/* Grid */}
                    <div className="causes-grid">
                        {campaigns.length === 0 ? (
                            <p className="no-causes-msg">
                                <strong>Nothing here yet.</strong>{' '}
                                Try adjusting your search or filter.
                            </p>
                        ) : (
                            campaigns.map(campaign => (
                                <button
                                    className="cause-card"
                                    key={campaign.id}
                                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                    type="button"
                                >
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
                                    </div>
                                    <div className="cause-info">
                                        <h3 className="cause-title">{campaign.title}</h3>
                                        <p className="cause-snippet">
                                            {campaign.story ? campaign.story.substring(0, 90) + '…' : 'No description provided.'}
                                        </p>
                                        <div className="cause-card-footer">
                                            <p className="cause-author">{campaign.authorName || 'Anonymous'}</p>
                                            <span className="cause-read-more">View →</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Causes;