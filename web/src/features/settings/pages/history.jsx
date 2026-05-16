import { useEffect, useState } from 'react';
import { useAuth } from '../../../core/context/AuthContext';
import { donationsApi } from '../../../core/services/apiService';
import Sidebar from '../../../core/components/sidebar';
import NotificationBell from '../../../core/components/notificationBell';
import '../styles/settings.css';

const History = () => {
    const { user } = useAuth();
    const [donationHistory, setDonationHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);
                const history = await donationsApi.my();
                setDonationHistory(Array.isArray(history) ? history : []);
            } catch (error) {
                setMessage(error.message || 'Failed to load donation history.');
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="settings-layout">
            <Sidebar />
            <main className="settings-main">
                <header className="top-header">
                    <div className="header-left" />
                    <div className="header-right">
                        <NotificationBell />
                        <div className="user-profile">
                            <span>{user?.name || 'User'}</span>
                            <div className="user-avatar-placeholder" />
                        </div>
                    </div>
                </header>
                <div className="settings-body">
                    <h1 className="settings-title">History</h1>
                    <p className="settings-subtitle">Review your donation activity.</p>
                    {message && <p className={`donation-msg ${message.toLowerCase().includes('failed') ? 'error' : 'success'}`}>{message}</p>}

                    <div className="settings-section">
                        <div className="settings-section-title">Donation History</div>
                        <div className="settings-card">
                            {loadingHistory && <p className="settings-row-value">Loading donations...</p>}
                            {!loadingHistory && donationHistory.length === 0 && (
                                <p className="settings-row-value">No donations yet.</p>
                            )}
                            {!loadingHistory && donationHistory.length > 0 && (
                                <div style={{ display: 'grid', gap: '0.6rem' }}>
                                    {donationHistory.map((donation) => (
                                        <div key={donation.id} className="settings-row">
                                            <span className="settings-row-label">{donation.campaignTitle || `Campaign #${donation.campaignId}`}</span>
                                            <span className="settings-row-value">₱{Number(donation.amount || 0).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default History;
