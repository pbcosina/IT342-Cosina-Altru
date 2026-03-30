import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import './fundraise.css';

const CATEGORIES = [
    'Health',
    'Education',
    'disaster',
    'community development',
    'children/youth',
    'environment',
    'animal welfare',
    'sports/recreation',
    'memorial/funeral',
    'others: state',
];

const CATEGORY_ICONS = {
    'Health': '🏥',
    'Education': '📚',
    'disaster': '🌪️',
    'community development': '🏘️',
    'children/youth': '🧒',
    'environment': '🌿',
    'animal welfare': '🐾',
    'sports/recreation': '⚽',
    'memorial/funeral': '🕊️',
    'others: state': '📋',
};

const initialForm = {
    title: '',
    story: '',
    category: '',
    donationGoal: '',
    imageUrl: '',
    whoFor: ''
};

// Steps: 1=whoFor, 2=title, 3=category, 4=goal, 5=image+story
const STEP_LABELS = ['Who For', 'Title', 'Category', 'Goal', 'Story'];

const Fundraise = () => {
    const { user } = useAuth();
    const [view, setView] = useState('list');       // 'list' | 'steps' | 'preview'
    const [formStep, setFormStep] = useState(1);    // 1–5
    const [myCauses, setMyCauses] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState('');
    const [stepError, setStepError] = useState('');

    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    useEffect(() => {
        if (view === 'list') fetchMyCauses();
    }, [view]);

    const fetchMyCauses = async () => {
        try {
            const res = await api.get('/causes/my');
            setMyCauses(res.data);
        } catch (error) {
            console.error('Failed to fetch my causes', error);
        }
    };

    const handleCreateClick = () => {
        setFormData(initialForm);
        setCurrentId(null);
        setFormStep(1);
        setView('steps');
        setMessage('');
        setStepError('');
    };

    const handleEditClick = (cause) => {
        setFormData({
            title: cause.title,
            story: cause.story,
            category: cause.category,
            donationGoal: cause.donationGoal,
            imageUrl: cause.imageUrl || '',
            whoFor: cause.whoFor || ''
        });
        setCurrentId(cause.id);
        setView('edit');       // <-- flat edit form, not the wizard
        setMessage('');
        setStepError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await api.delete(`/causes/${id}`);
            fetchMyCauses();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setStepError('');
    };

    // Validate current step before proceeding
    const validateStep = () => {
        if (formStep === 1 && !formData.whoFor) {
            setStepError('Please select who you are raising funds for.');
            return false;
        }
        if (formStep === 2 && !formData.title.trim()) {
            setStepError('Please enter a campaign title.');
            return false;
        }
        if (formStep === 3 && !formData.category) {
            setStepError('Please select a category.');
            return false;
        }
        if (formStep === 4) {
            if (!formData.donationGoal || Number(formData.donationGoal) <= 0) {
                setStepError('Please enter a valid donation goal greater than 0.');
                return false;
            }
        }
        if (formStep === 5 && !formData.story.trim()) {
            setStepError('Please tell your story.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        setStepError('');
        if (formStep < 5) {
            setFormStep(s => s + 1);
        } else {
            setView('preview');
        }
    };

    const handleBack = () => {
        setStepError('');
        if (formStep > 1) {
            setFormStep(s => s - 1);
        } else {
            setView('list');
        }
    };

    const handleWhoForSelect = (who) => {
        setFormData(prev => ({ ...prev, whoFor: who }));
        setStepError('');
        setFormStep(2);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setView('preview');
    };

    const handleSave = async (status) => {
        try {
            const payload = { ...formData, status };
            if (currentId) {
                await api.put(`/causes/${currentId}`, payload);
            } else {
                await api.post('/causes', payload);
            }
            setMessage(`Campaign ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);
            setTimeout(() => {
                setMessage('');
                setView('list');
            }, 1800);
        } catch (error) {
            console.error('Save failed', error);
            setMessage('Failed to save. Please try again.');
        }
    };

    // ── Step progress indicator ──────────────────────
    const StepBar = () => {
        const steps = currentId
            ? [2, 3, 4, 5]  // When editing, skip step 1
            : [1, 2, 3, 4, 5];

        return (
            <div className="step-bar">
                {steps.map((step, idx) => {
                    const isCompleted = formStep > step;
                    const isActive = formStep === step;
                    return (
                        <div className="step-bar-item" key={step}>
                            {idx > 0 && <div className={`step-connector ${isCompleted ? 'done' : ''}`} />}
                            <div className={`step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'done' : ''}`}>
                                {isCompleted
                                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    : step
                                }
                            </div>
                            <span className={`step-dot-label ${isActive ? 'active' : ''}`}>
                                {STEP_LABELS[step - 1]}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="causes-layout">
            <Sidebar />
            <main className="main-content causes-main">
                <header className="top-header">
                    <div className="user-profile">
                        <span>{user?.name || 'User'}</span>
                        <div className="user-avatar-placeholder" />
                    </div>
                </header>

                <div className="content-body">
                    {message && <div className="fundraise-message">{message}</div>}

                    {/* ── LIST VIEW ── */}
                    {view === 'list' && (
                        <div className="fundraise-list-view">
                            <div className="list-header">
                                <div className="list-header-text">
                                    <h2>My Campaigns</h2>
                                    <p>Manage your fundraising campaigns</p>
                                </div>
                                <button className="start-btn" onClick={handleCreateClick}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
                                    </svg>
                                    New Campaign
                                </button>
                            </div>

                            {myCauses.length === 0 ? (
                                <div className="empty-state">
                                    <p>You haven't started any campaigns yet.<br />Hit <strong>New Campaign</strong> to get started.</p>
                                </div>
                            ) : (
                                <div className="causes-grid">
                                    {myCauses.map(cause => (
                                        <div className="cause-card" key={cause.id}>
                                            <div
                                                className="cause-image"
                                                style={{ backgroundImage: `url(${cause.imageUrl || 'https://images.unsplash.com/photo-1594750018092-36b0e3dd95de?w=600&auto=format&fit=crop'})` }}
                                            />
                                            <div className="cause-info">
                                                <span className={`cause-status-badge ${cause.status === 'PUBLISHED' ? 'published' : 'draft'}`}>
                                                    {cause.status === 'PUBLISHED' ? '● Published' : '○ Draft'}
                                                </span>
                                                <h3 className="cause-title">{cause.title}</h3>
                                                <p className="cause-meta-row">
                                                    Goal: <strong>₱{Number(cause.donationGoal).toLocaleString()}</strong> &nbsp;·&nbsp;
                                                    Raised: <strong>₱{Number(cause.currentDonation).toLocaleString()}</strong>
                                                </p>
                                                <div className="card-actions">
                                                    <button onClick={() => handleEditClick(cause)} className="edit-btn">Edit</button>
                                                    <button onClick={() => handleDelete(cause.id)} className="delete-btn">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── MULTI-STEP FORM ── */}
                    {view === 'steps' && (
                        <div className="wizard-wrapper">
                            <StepBar />

                            {/* Error */}
                            {stepError && (
                                <div className="step-error">{stepError}</div>
                            )}

                            {/* ── STEP 1: Who For ── */}
                            {formStep === 1 && (
                                <div className="step-panel">
                                    <div className="step-heading">
                                        <p className="form-step-label">Step 1 of 5</p>
                                        <h2>Who are you raising funds for?</h2>
                                        <p className="step-subtitle">This helps us tailor your campaign setup</p>
                                    </div>

                                    <div className="who-for-options">
                                        {[
                                            { label: 'Yourself', icon: '🙋', desc: 'Funds go directly to your account for personal use' },
                                            { label: 'Someone Else', icon: '🤝', desc: "You'll collect and distribute funds to a beneficiary" },
                                            { label: 'Charity', icon: '🏛️', desc: 'Raise on behalf of a registered non-profit organization' },
                                        ].map(({ label, icon, desc }) => (
                                            <div
                                                className={`who-for-card ${formData.whoFor === label ? 'selected' : ''}`}
                                                key={label}
                                                onClick={() => handleWhoForSelect(label)}
                                            >
                                                <div className="icon-placeholder">{icon}</div>
                                                <div className="who-for-text">
                                                    <h3>{label}</h3>
                                                    <p>{desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={() => setView('list')}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2: Campaign Title ── */}
                            {formStep === 2 && (
                                <div className="step-panel">
                                    <div className="step-heading">
                                        <p className="form-step-label">Step 2 of 5</p>
                                        <h2>What's your campaign title?</h2>
                                        <p className="step-subtitle">Write a clear, compelling title that tells people what you're raising for</p>
                                    </div>

                                    <div className="step-field-large">
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Help rebuild our community center"
                                            className="step-input-large"
                                            autoFocus
                                            maxLength={120}
                                        />
                                        <span className="char-count">{formData.title.length}/120</span>
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}>← Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue →</button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3: Category ── */}
                            {formStep === 3 && (
                                <div className="step-panel">
                                    <div className="step-heading">
                                        <p className="form-step-label">Step 3 of 5</p>
                                        <h2>Choose a category</h2>
                                        <p className="step-subtitle">This helps donors find your campaign through search</p>
                                    </div>

                                    <div className="category-grid">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                className={`category-tile ${formData.category === cat ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, category: cat }));
                                                    setStepError('');
                                                }}
                                            >
                                                <span className="category-tile-icon">{CATEGORY_ICONS[cat]}</span>
                                                <span className="category-tile-label">
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}>← Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue →</button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 4: Donation Goal ── */}
                            {formStep === 4 && (
                                <div className="step-panel">
                                    <div className="step-heading">
                                        <p className="form-step-label">Step 4 of 5</p>
                                        <h2>Set your donation goal</h2>
                                        <p className="step-subtitle">How much do you need to raise? You can always edit this later.</p>
                                    </div>

                                    <div className="goal-input-wrapper">
                                        <span className="goal-currency">₱</span>
                                        <input
                                            type="number"
                                            name="donationGoal"
                                            value={formData.donationGoal}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="goal-input"
                                            min="1"
                                            autoFocus
                                        />
                                    </div>
                                    {formData.donationGoal > 0 && (
                                        <p className="goal-preview">
                                            Goal: <strong>₱{Number(formData.donationGoal).toLocaleString()}</strong>
                                        </p>
                                    )}

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}>← Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue →</button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 5: Image + Story ── */}
                            {formStep === 5 && (
                                <div className="step-panel step-panel-wide">
                                    <div className="step-heading">
                                        <p className="form-step-label">Step 5 of 5</p>
                                        <h2>Add your image & story</h2>
                                        <p className="step-subtitle">A strong photo and detailed story significantly increase donations</p>
                                    </div>

                                    <div className="fundraise-form">
                                        <div className="form-group">
                                            <label>
                                                Campaign Image URL
                                                <span className="label-optional"> — optional</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleChange}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                            {formData.imageUrl && (
                                                <div className="img-preview" style={{ backgroundImage: `url(${formData.imageUrl})` }} />
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Your Story</label>
                                            <textarea
                                                name="story"
                                                value={formData.story}
                                                onChange={handleChange}
                                                rows={9}
                                                placeholder="Why are you raising funds? What will the money be used for? Share your story honestly — people respond to real, heartfelt accounts."
                                            />
                                        </div>
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}>← Back</button>
                                        <button className="next-btn" onClick={handleNext}>Preview Campaign →</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ── FLAT EDIT FORM ── */}
                    {view === 'edit' && (
                        <div className="fundraise-form-view">
                            <div className="edit-form-header">
                                <button className="back-link" onClick={() => { setCurrentId(null); setView('list'); }}>← Back</button>
                                <div>
                                    <p className="form-step-label">Editing Campaign</p>
                                    <h2>Edit Campaign Details</h2>
                                </div>
                            </div>

                            <form onSubmit={handleEditSubmit} className="fundraise-form">
                                <div className="form-group">
                                    <label>Campaign Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Write a clear, compelling title"
                                        maxLength={120}
                                    />
                                </div>

                                <div className="form-group row-group">
                                    <div className="col">
                                        <label>Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="" disabled>Select a category</option>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label>Donation Goal (₱)</label>
                                        <input
                                            type="number"
                                            name="donationGoal"
                                            value={formData.donationGoal}
                                            onChange={handleChange}
                                            required
                                            placeholder="0"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Campaign Image URL
                                        <span className="label-optional"> — optional</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                    {formData.imageUrl && (
                                        <div className="img-preview" style={{ backgroundImage: `url(${formData.imageUrl})` }} />
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Your Story</label>
                                    <textarea
                                        name="story"
                                        value={formData.story}
                                        onChange={handleChange}
                                        required
                                        rows={9}
                                        placeholder="Why are you raising funds? What will the money be used for?"
                                    />
                                </div>

                                <button type="submit" className="preview-btn">Preview Changes →</button>
                            </form>
                        </div>
                    )}


                    {view === 'preview' && (
                        <div className="preview-view">
                            <div className="preview-header">
                                <button className="back-link" onClick={() => currentId ? setView('edit') : (setView('steps'), setFormStep(5))}>← Back to Edit</button>
                                <h2>Preview Campaign</h2>
                            </div>

                            <div className="cause-details-container preview-container">
                                <div
                                    className="cause-details-image"
                                    style={{ backgroundImage: `url(${formData.imageUrl || 'https://images.unsplash.com/photo-1594750018092-36b0e3dd95de?w=800&auto=format&fit=crop'})` }}
                                />
                                <h1 className="cause-details-title">{formData.title}</h1>
                                <div className="cause-meta">
                                    {formData.category && <span className="cause-category">{formData.category}</span>}
                                    {formData.whoFor && <span className="cause-whofor">For: {formData.whoFor}</span>}
                                    <span className="cause-author-meta">Goal: ₱{Number(formData.donationGoal || 0).toLocaleString()}</span>
                                </div>
                                <div className="cause-story">
                                    <h2>About this cause</h2>
                                    <p>{formData.story}</p>
                                </div>
                            </div>

                            <div className="publish-actions">
                                <button className="draft-btn" onClick={() => handleSave('DRAFT')}>Save as Draft</button>
                                <button className="publish-btn" onClick={() => handleSave('PUBLISHED')}>
                                    {currentId ? 'Update & Publish' : 'Publish Campaign'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Fundraise;