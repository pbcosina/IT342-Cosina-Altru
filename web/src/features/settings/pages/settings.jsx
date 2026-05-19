import { useAuth } from '../../../core/context/AuthContext';
import { useEffect, useState } from 'react';
import { usersApi } from '../../../core/services/apiService';
import Sidebar from '../../../core/components/sidebar';
import NotificationBell from '../../../core/components/notificationBell';
import ProfileMenu from '../../../core/components/profileMenu';
import '../styles/settings.css';

const Settings = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', profileImageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || '',
            profileImageUrl: user?.profileImageUrl || '',
        }));
    }, [user]);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setMessage('Please upload a JPG or PNG image.');
            return;
        }

        const maxInputBytes = 5 * 1024 * 1024;
        if (file.size > maxInputBytes) {
            setMessage('Image is too large. Please choose a file under 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const maxSize = 512;
                const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
                const targetWidth = Math.round(image.width * scale);
                const targetHeight = Math.round(image.height * scale);

                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const context = canvas.getContext('2d');
                if (!context) {
                    setMessage('Unable to process image.');
                    return;
                }

                context.drawImage(image, 0, 0, targetWidth, targetHeight);
                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(outputType, 0.85);

                const base64Length = dataUrl.split(',')[1]?.length || 0;
                const approxBytes = Math.floor((base64Length * 3) / 4);
                if (approxBytes > 1_500_000) {
                    setMessage('Image is still too large after processing. Please choose a smaller image.');
                    return;
                }

                setForm(prev => ({ ...prev, profileImageUrl: dataUrl }));
                setMessage('');
            };
            image.onerror = () => setMessage('Unable to read image.');
            image.src = reader.result;
        };
        reader.onerror = () => setMessage('Unable to read image.');
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
                    <div className="header-left" />
                    <div className="header-right">
                        <NotificationBell />
                        <ProfileMenu />
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
                                        <input type="file" accept="image/jpeg,image/png" onChange={onImageChange} />
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
                                    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                                        <input
                                            style={inputStyle}
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={form.currentPassword}
                                            onChange={onChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                                            aria-pressed={showCurrentPassword}
                                            aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'inherit',
                                                cursor: 'pointer',
                                                padding: 0,
                                                lineHeight: 0
                                            }}
                                        >
                                            {showCurrentPassword ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18.4 18.4 0 0 1 5-5" />
                                                    <path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.2 4.7" />
                                                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                    <path d="M3 3l18 18" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <span className="settings-row-label">New Password</span>
                                    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                                        <input
                                            style={inputStyle}
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={onChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            aria-pressed={showNewPassword}
                                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'inherit',
                                                cursor: 'pointer',
                                                padding: 0,
                                                lineHeight: 0
                                            }}
                                        >
                                            {showNewPassword ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18.4 18.4 0 0 1 5-5" />
                                                    <path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.2 4.7" />
                                                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                    <path d="M3 3l18 18" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-row" style={{ justifyContent: 'flex-end' }}>
                                    <button className="settings-row-action" type="submit" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Settings;