import { useState } from 'react';
import { useAuth } from '../../../core/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import shapeAuth from '../../../assets/shape-auth.png';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

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
        if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
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

    const handleGoogleLogin = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const authResult = await googleLogin(idToken);

            if (authResult.success) {
                navigate('/dashboard');
            } else {
                setError(authResult.error || 'Google sign-in failed');
            }
        } catch (err) {
            console.error('Google sign-in failed:', err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
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
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="auth-input"
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
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
                            {password && (
                                <div className="password-requirements-box">
                                    <div className="requirements-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4M12 8h.01" />
                                        </svg>
                                        Password Requirements
                                    </div>
                                    <ul className="requirements-list">
                                        <li className={hasMinLength ? 'requirement-met' : 'requirement-unmet'}>
                                            <span className="requirement-icon" aria-hidden="true">
                                                {hasMinLength ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 12 3 3 5-6" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 8 8 8" />
                                                        <path d="m16 8-8 8" />
                                                    </svg>
                                                )}
                                            </span>
                                            At least 8 characters long
                                        </li>
                                        <li className={hasUppercase ? 'requirement-met' : 'requirement-unmet'}>
                                            <span className="requirement-icon" aria-hidden="true">
                                                {hasUppercase ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 12 3 3 5-6" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 8 8 8" />
                                                        <path d="m16 8-8 8" />
                                                    </svg>
                                                )}
                                            </span>
                                            Must contain at least one uppercase letter (A-Z)
                                        </li>
                                        <li className={hasLowercase ? 'requirement-met' : 'requirement-unmet'}>
                                            <span className="requirement-icon" aria-hidden="true">
                                                {hasLowercase ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 12 3 3 5-6" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 8 8 8" />
                                                        <path d="m16 8-8 8" />
                                                    </svg>
                                                )}
                                            </span>
                                            Must contain at least one lowercase letter (a-z)
                                        </li>
                                        <li className={hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                                            <span className="requirement-icon" aria-hidden="true">
                                                {hasNumber ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 12 3 3 5-6" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 8 8 8" />
                                                        <path d="m16 8-8 8" />
                                                    </svg>
                                                )}
                                            </span>
                                            Must contain at least one number (0-9)
                                        </li>
                                        <li className={hasSymbol ? 'requirement-met' : 'requirement-unmet'}>
                                            <span className="requirement-icon" aria-hidden="true">
                                                {hasSymbol ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 12 3 3 5-6" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="m8 8 8 8" />
                                                        <path d="m16 8-8 8" />
                                                    </svg>
                                                )}
                                            </span>
                                            Must contain at least one symbol
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="register-confirm-password">
                                Confirm Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="auth-input"
                                    id="register-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-pressed={showConfirmPassword}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
                                    {showConfirmPassword ? (
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

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading || googleLoading}
                            id="register-submit-btn"
                        >
                            <span>{loading ? 'Creating account...' : 'Register'}</span>
                        </button>
                    </form>

                    <div className="auth-divider" aria-hidden="true">
                        <span>or</span>
                    </div>

                    <button
                        className="auth-google-btn"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                    >
                        <span className="auth-google-btn-text">
                            {googleLoading ? 'Connecting...' : 'Continue with Google'}
                        </span>
                    </button>

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