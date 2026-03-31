import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar';
import './settings.css';

const Settings = () => {
    const { user } = useAuth();

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

                    <div className="settings-section">
                        <div className="settings-section-title">Profile</div>
                        <div className="settings-card">
                            <div className="settings-row">
                                <span className="settings-row-label">Name</span>
                                <span className="settings-row-value">{user?.name || '—'}</span>
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">Email</span>
                                <span className="settings-row-value">{user?.email || '—'}</span>
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">Password</span>
                                <button className="settings-row-action">Change password</button>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="settings-section-title">Account</div>
                        <div className="settings-card">
                            <div className="settings-row">
                                <span className="settings-row-label">Notifications</span>
                                <button className="settings-row-action">Manage</button>
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">Delete account</span>
                                <button className="settings-row-action" style={{ color: '#b91c1c' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;