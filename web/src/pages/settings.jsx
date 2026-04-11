import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { donationsApi, usersApi } from '../services/apiService';
import Sidebar from '../components/sidebar';
import './settings.css';

const Settings = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', profileImageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [donationHistory, setDonationHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || '',
            profileImageUrl: user?.profileImageUrl || '',
        }));
    }, [user]);

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

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setForm(prev => ({ ...prev, profileImageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            await usersApi.updateMe(form);
            setMessage('Profile updated successfully. Reload to refresh header details.');
            setForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (error) {
            setMessage(error.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%',
        maxWidth: '340px',
        padding: '10px 12px',
        border: '1px solid #c8c0b6',
        borderRadius: '8px',
    };

    return (
        <div className="settings-layout">
            <Sidebar />
            <main className="settings-main">
                <header className="top-header">
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" />
                    </div>
                </header>
                <div className="settings-body">
                    <h1 className="settings-title">Settings</h1>
                    <p className="settings-subtitle">Manage your account preferences and profile details.</p>
                    {message && <p className={`donation-msg ${message.toLowerCase().includes('failed') ? 'error' : 'success'}`}>{message}</p>}

                    <div className="settings-section">
                        <div className="settings-section-title">Profile</div>
                        <div className="settings-card">
                            <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.75rem' }}>
                                <div className="settings-row" style={{ alignItems: 'center' }}>
                                    <span className="settings-row-label">Profile Picture</span>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <img
                                            src={form.profileImageUrl || 'https://via.placeholder.com/50'}
                                            alt="Profile"
                                            style={{ width: 50, height: 50, borderRadius: '999px', objectFit: 'cover' }}
                                        />
                                        <input type="file" accept="image/*" onChange={onImageChange} />
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <span className="settings-row-label">Name</span>
                                    <input style={inputStyle} name="name" value={form.name} onChange={onChange} required />
                                </div>
                                <div className="settings-row">
                                    <span className="settings-row-label">Email</span>
                                    <input style={inputStyle} type="email" name="email" value={form.email} onChange={onChange} required />
                                </div>
                                <div className="settings-row">
                                    <span className="settings-row-label">Current Password</span>
                                    <input style={inputStyle} type="password" name="currentPassword" value={form.currentPassword} onChange={onChange} />
                                </div>
                                <div className="settings-row">
                                    <span className="settings-row-label">New Password</span>
                                    <input style={inputStyle} type="password" name="newPassword" value={form.newPassword} onChange={onChange} />
                                </div>
                                <div className="settings-row" style={{ justifyContent: 'flex-end' }}>
                                    <button className="settings-row-action" type="submit" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="settings-section-title">Donation History</div>
                        <div className="settings-card">
                            {loadingHistory ? (
                                <p className="settings-row-value">Loading donations...</p>
                            ) : donationHistory.length === 0 ? (
                                <p className="settings-row-value">No donations yet.</p>
                            ) : (
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

export default Settings;