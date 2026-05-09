import { useState } from 'react';
import { useAuth } from '../../../core/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import shapeAuth from '../../../assets/shape-auth.png';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        setPasswordError('');

        const normalizedEmail = email.trim();
        if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
            setEmailError('Invalid email');
            return;
        }

        if (!password.trim()) {
            setPasswordError('Invalid password');
            return;
        }

        setLoading(true);
        const result = await login(normalizedEmail, password);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            const rawMessage = (result.error || '').toLowerCase();
            if (rawMessage.includes('email') || rawMessage.includes('user')) {
                setEmailError('Invalid email');
            } else if (rawMessage) {
                setPasswordError('Invalid password');
            } else {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="auth-container" style={{ backgroundImage: `url(${shapeAuth})` }}>
            {/* Left Visual Side (spacer) */}
            <div className="auth-visual" />

            {/* Right Form Side */}
            <div className="auth-form-section">
                <div className="auth-form-wrapper">
                    {/* Back to Home */}
                    <button
                        className="auth-back-link"
                        onClick={() => navigate('/')}
                        type="button"
                    >
                        ← Back to home
                    </button>

                    {/* Header */}
                    <div className="auth-form-header">
                        <h1 className="auth-form-title">Welcome back!</h1>
                        <p className="auth-form-subtitle">
                            Enter your credentials to continue your journey
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="auth-alert" role="alert">
                            <span className="auth-alert-icon" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v4" />
                                    <path d="M12 17h.01" />
                                    <path d="M10.3 3.5 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
                                </svg>
                            </span>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="login-email">
                                Email Address
                            </label>
                            <input
                                className="auth-input"
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                                required
                                autoComplete="email"
                            />
                            {emailError && <p className="auth-alert" style={{ marginTop: '0.45rem' }}>{emailError}</p>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="login-password">
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="auth-input"
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) setPasswordError('');
                                    }}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-pressed={showPassword}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                                    {showPassword ? (
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
                            {passwordError && <p className="auth-alert" style={{ marginTop: '0.45rem' }}>{passwordError}</p>}
                        </div>

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                            id="login-submit-btn"
                        >
                            <span>{loading ? 'Signing in...' : 'Login'}</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-form-footer">
                        Don't have an account?{' '}
                        <Link to="/register">Create here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;