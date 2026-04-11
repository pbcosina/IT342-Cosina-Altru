import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import shapeAuth from '../assets/shape-auth.png';
import './auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
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
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                className="auth-input"
                                id="login-password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
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