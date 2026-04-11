import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import shapeAuth from '../assets/shape-auth.png';
import './auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate email
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password requirements
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password should have at least one uppercase letter');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError('Password should have at least one lowercase letter');
            return;
        }
        if (!/\d/.test(password)) {
            setError('Password should have at least one numeric digit');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setError('Password should have at least one symbol');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
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
                        <h1 className="auth-form-title">Create Account</h1>
                        <p className="auth-form-subtitle">
                            Get started with your account
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
                            <label className="auth-input-label" htmlFor="register-name">
                                Name
                            </label>
                            <input
                                className="auth-input"
                                id="register-name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="register-email">
                                Email Address
                            </label>
                            <input
                                className="auth-input"
                                id="register-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="register-password">
                                Password
                            </label>
                            <input
                                className="auth-input"
                                id="register-password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="register-confirm-password">
                                Confirm Password
                            </label>
                            <input
                                className="auth-input"
                                id="register-confirm-password"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                            id="register-submit-btn"
                        >
                            <span>{loading ? 'Creating account...' : 'Register'}</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-form-footer">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;