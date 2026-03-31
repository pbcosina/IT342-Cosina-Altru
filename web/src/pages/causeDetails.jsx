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

    const fetchCauseDetails = useCallback(async () => {
        try {
            const data = await campaignsApi.getById(id);
            setCampaign(data);
        } catch (error) {
            console.error('Failed to fetch campaign details', error);
        }
    }, [id]);

    useEffect(() => {
        fetchCauseDetails();
    }, [fetchCauseDetails]);

    const handleDonate = async () => {
        const amount = Number(donationAmount);
        if (!donationAmount || Number.isNaN(amount) || amount <= 0) {
            setMessage('Please enter a valid amount.');
            return;
        }
        try {
            await donationsApi.create(id, amount);
            setMessage('Donation successful! Thank you.');
            setDonationAmount('');
            fetchCauseDetails();
        } catch (error) {
            console.error('Donation failed', error);
            setMessage(error.message || 'Donation failed.');
        }
    };

    if (!campaign) return <div className="causes-layout"><Sidebar /><main className="main-content">Loading...</main></div>;

    return (
        <div className="causes-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header" style={{ justifyContent: 'space-between' }}>
                    <button className="back-btn" onClick={() => navigate('/campaigns')}>&larr; Back to Campaigns</button>
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

                            <input
                                type="number"
                                placeholder="Amount to donate (₱)"
                                className="donation-input"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                            />
                            <button className="donate-btn" onClick={handleDonate}>Donate Now</button>
                            {message && <p className={`donation-msg ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CauseDetails;