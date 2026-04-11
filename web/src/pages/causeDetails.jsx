import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignsApi, donationsApi } from '../services/apiService';
import Sidebar from '../components/sidebar';
import { useAuth } from '../context/AuthContext';
import './causeDetails.css';

const CauseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [message, setMessage] = useState('');
    const [donorMessage, setDonorMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCauseDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await campaignsApi.getById(id);
            setCampaign(data);
        } catch (error) {
            console.error('Failed to fetch campaign details', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchDonors = useCallback(async () => {
        try {
            const data = await donationsApi.byCampaign(id);
            setDonors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch donors', error);
        }
    }, [id]);

    useEffect(() => {
        fetchCauseDetails();
        fetchDonors();
    }, [fetchCauseDetails, fetchDonors]);

    const handleDonate = async () => {
        const amount = Number(donationAmount);
        if (!donationAmount || Number.isNaN(amount) || amount <= 0) {
            setMessage('Please enter a valid amount.');
            return;
        }
        try {
            await donationsApi.create(id, amount, undefined, anonymous, donorMessage);
            setMessage('Donation successful! Thank you.');
            setDonationAmount('');
            setDonorMessage('');
            setAnonymous(false);
            fetchCauseDetails();
            fetchDonors();
        } catch (error) {
            console.error('Donation failed', error);
            setMessage(error.message || 'Donation failed.');
        }
    };

    const handleShare = async () => {
        const link = window.location.href;
        try {
            await navigator.clipboard.writeText(link);
            setMessage('Campaign link copied to clipboard.');
        } catch (error) {
            setMessage('Unable to copy link.');
        }
    };

    if (loading || !campaign) return <div className="causes-layout"><Sidebar /><main className="main-content">Loading campaign details...</main></div>;

    return (
        <div className="causes-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header" style={{ justifyContent: 'space-between' }}>
                    <button className="back-btn" onClick={() => navigate('/campaigns')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <span>Back to Campaigns</span>
                    </button>
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" />
                    </div>
                </header>
                <div className="content-body cause-details-body">
                    <div className="cause-main-section">
                        <div className="cause-details-container">
                            <div className="cause-details-image" style={{ backgroundImage: `url(${campaign.imageUrl || 'https://via.placeholder.com/800'})` }}></div>
                            <h1 className="cause-details-title">{campaign.title}</h1>
                            <div className="cause-meta">
                                <span className="cause-category">{campaign.category || 'General'}</span>
                                <span className="cause-author-meta">by {campaign.authorName}</span>
                                {campaign.whoFor && <span className="cause-whofor">For: {campaign.whoFor}</span>}
                            </div>

                            <div className="cause-story">
                                <h2>About this campaign</h2>
                                <p>{campaign.story}</p>
                            </div>
                        </div>
                    </div>

                    <div className="cause-side-section">
                        <div className="donation-card">
                            <div className="cause-stats">
                                <div className="stat-box">
                                    <span className="stat-label">Raised</span>
                                    <span className="stat-value">₱{campaign.currentDonation}</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Goal</span>
                                    <span className="stat-value goal">₱{campaign.donationGoal}</span>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${Math.min(100, (campaign.currentDonation / campaign.donationGoal) * 100)}%` }}
                                ></div>
                            </div>

                            <h3 className="support-title">Support this campaign</h3>
                            <p className="support-sub">Your contribution makes a huge difference.</p>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                                {[100, 500, 1000].map((value) => (
                                    <button key={value} type="button" className="back-btn" onClick={() => setDonationAmount(String(value))}>
                                        ₱{value}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="number"
                                placeholder="Amount to donate (₱)"
                                className="donation-input"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                            />
                            <textarea
                                className="donation-input"
                                placeholder="Add a short message (optional)"
                                value={donorMessage}
                                onChange={(e) => setDonorMessage(e.target.value)}
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                                Donate anonymously
                            </label>
                            <button className="donate-btn" onClick={handleDonate}>Donate Now</button>
                            <button className="back-btn" onClick={handleShare} style={{ marginTop: '0.6rem' }}>Copy Link / Share</button>
                            {message && <p className={`donation-msg ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}

                            <div style={{ marginTop: '1rem' }}>
                                <h4 className="support-title" style={{ marginBottom: '0.6rem' }}>Recent Donors</h4>
                                {donors.length === 0 ? (
                                    <p className="support-sub">No donations yet. Be the first supporter.</p>
                                ) : (
                                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                                        {donors.map((donation) => (
                                            <div key={donation.id} style={{ background: '#fff', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                    <strong>{donation.donorName || 'Anonymous'}</strong>
                                                    <strong>₱{Number(donation.amount || 0).toLocaleString()}</strong>
                                                </div>
                                                {donation.donorMessage && (
                                                    <p className="support-sub" style={{ marginTop: '0.25rem' }}>{donation.donorMessage}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CauseDetails;