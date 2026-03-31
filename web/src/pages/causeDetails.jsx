import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { useAuth } from '../context/AuthContext';
import './causeDetails.css';

const CauseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cause, setCause] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const fetchCauseDetails = useCallback(async () => {
        try {
            const res = await api.get(`/causes/${id}`);
            setCause(res.data);
        } catch (error) {
            console.error('Failed to fetch cause details', error);
        }
    }, [api, id]);

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
            await api.post(`/causes/${id}/donate?amount=${amount}`);
            setMessage('Donation successful! Thank you.');
            setDonationAmount('');
            fetchCauseDetails(); // Refresh donations
        } catch (error) {
            console.error('Donation failed', error);
            setMessage('Donation failed.');
        }
    };

    if (!cause) return <div className="causes-layout"><Sidebar /><main className="main-content">Loading...</main></div>;

    return (
        <div className="causes-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header" style={{ justifyContent: 'space-between' }}>
                    <button className="back-btn" onClick={() => navigate('/causes')}>&larr; Back to Causes</button>
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" />
                    </div>
                </header>
                <div className="content-body cause-details-body">
                    <div className="cause-main-section">
                        <div className="cause-details-container">
                            <div className="cause-details-image" style={{ backgroundImage: `url(${cause.imageUrl || 'https://via.placeholder.com/800'})` }}></div>
                            <h1 className="cause-details-title">{cause.title}</h1>
                            <div className="cause-meta">
                                <span className="cause-category">{cause.category || 'General'}</span>
                                <span className="cause-author-meta">by {cause.authorName}</span>
                                {cause.whoFor && <span className="cause-whofor">For: {cause.whoFor}</span>}
                            </div>

                            <div className="cause-story">
                                <h2>About this cause</h2>
                                <p>{cause.story}</p>
                            </div>
                        </div>
                    </div>

                    <div className="cause-side-section">
                        <div className="donation-card">
                            <div className="cause-stats">
                                <div className="stat-box">
                                    <span className="stat-label">Raised</span>
                                    <span className="stat-value">₱{cause.currentDonation}</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Goal</span>
                                    <span className="stat-value goal">₱{cause.donationGoal}</span>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${Math.min(100, (cause.currentDonation / cause.donationGoal) * 100)}%` }}
                                ></div>
                            </div>

                            <h3 className="support-title">Support this cause</h3>
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