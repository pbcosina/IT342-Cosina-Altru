import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { campaignsApi } from '../services/apiService';
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

const ICON_PATHS = {
    health: 'M3 11h18M7 7v8M17 7v8',
    education: 'M4 6h16v12H4z M8 6v12',
    disaster: 'M13 2 4 14h6l-1 8 9-12h-6z',
    community: 'M3 11l9-7 9 7v9h-6v-6H9v6H3z',
    children: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0',
    environment: 'M12 21C7 18 5 14 5 10c0-3 2-5 5-7 3 2 5 4 5 7 0 4-2 8-3 11z',
    animal: 'M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 18c1.5-2 3.5-3 6-3s4.5 1 6 3c0 2-2 3-6 3s-6-1-6-3z',
    sports: 'M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 0v18m-9-9h18',
    memorial: 'M12 3v18M6 9h12M8 21h8',
    others: 'M7 4h10l2 2v14H5V4zm3 5h6M10 13h6M10 17h4',
    yourself: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0',
    someoneElse: 'M16 11a3 3 0 1 0-2.8-4H13a3 3 0 0 0-2.8 4M8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3m0 0v1m8-2v2m-11 8a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6',
    charity: 'M3 10h18M5 10V7l7-4 7 4v3M7 10v8M12 10v8M17 10v8M4 21h16'
};

const Icon = ({ name, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICON_PATHS[name]} />
    </svg>
);

const ArrowLeftIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ArrowRightIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const initialForm = {
    title: '',
    story: '',
    category: '',
    donationGoal: '',
    imageUrl: '',
    whoFor: ''
};

const VIEW_KEY = 'campaignViews';

const readViews = () => {
    try {
        const raw = localStorage.getItem(VIEW_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeViews = (views) => {
    localStorage.setItem(VIEW_KEY, JSON.stringify(views));
};

// Steps: 1=whoFor, 2=title, 3=category, 4=goal, 5=image+story
const STEP_LABELS = ['Who For', 'Title', 'Category', 'Goal', 'Story'];

const StepBar = ({ currentId, formStep }) => {
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

StepBar.propTypes = {
    currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    formStep: PropTypes.number.isRequired,
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
};

ArrowLeftIcon.propTypes = {
    size: PropTypes.number,
};

ArrowRightIcon.propTypes = {
    size: PropTypes.number,
};

const Fundraise = () => {
    const { user } = useAuth();
    const [view, setView] = useState('list');       // 'list' | 'steps' | 'preview'
    const [formStep, setFormStep] = useState(1);    // 1–5
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState('');
    const [stepError, setStepError] = useState('');
    const [viewMap, setViewMap] = useState(() => readViews());

    const fetchMyCauses = useCallback(async () => {
        try {
            const data = await campaignsApi.my();
            setMyCampaigns(data);
        } catch (error) {
            console.error('Failed to fetch my campaigns', error);
        }
    }, []);

    useEffect(() => {
        if (view === 'list') fetchMyCauses();
    }, [view, fetchMyCauses]);

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
            await campaignsApi.remove(id);
            fetchMyCauses();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const bumpViewCount = (campaignId) => {
        if (!campaignId) return;
        const current = readViews();
        const next = { ...current, [campaignId]: (current[campaignId] || 0) + 1 };
        writeViews(next);
        setViewMap(next);
    };

    const handleMarkCompleted = async (cause) => {
        try {
            await campaignsApi.update(cause.id, {
                title: cause.title,
                story: cause.story,
                category: cause.category,
                donationGoal: cause.donationGoal,
                imageUrl: cause.imageUrl,
                whoFor: cause.whoFor,
                status: 'COMPLETED',
            });
            setMessage('Campaign marked as completed.');
            fetchMyCauses();
        } catch (error) {
            setMessage(error.message || 'Unable to update campaign status.');
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
                await campaignsApi.update(currentId, payload);
            } else {
                await campaignsApi.create(payload);
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

                            {myCampaigns.length === 0 ? (
                                <div className="empty-state">
                                    <p>You haven't started any campaigns yet.<br />Hit <strong>New Campaign</strong> to get started.</p>
                                </div>
                            ) : (
                                <div className="causes-grid">
                                    {myCampaigns.map(cause => (
                                        <div className="cause-card" key={cause.id}>
                                            <div
                                                className="cause-image"
                                                style={{ backgroundImage: `url(${cause.imageUrl || 'https://images.unsplash.com/photo-1594750018092-36b0e3dd95de?w=600&auto=format&fit=crop'})` }}
                                            />
                                            <div className="cause-info">
                                                <span className={`cause-status-badge ${cause.status === 'PUBLISHED' ? 'published' : 'draft'}`}>
                                                    {cause.status === 'PUBLISHED' ? '● Published' : cause.status === 'COMPLETED' ? '✓ Completed' : '○ Draft'}
                                                </span>
                                                <h3 className="cause-title">{cause.title}</h3>
                                                <p className="cause-meta-row">
                                                    Goal: <strong>₱{Number(cause.donationGoal).toLocaleString()}</strong> &nbsp;·&nbsp;
                                                    Raised: <strong>₱{Number(cause.currentDonation).toLocaleString()}</strong>
                                                </p>
                                                <p className="cause-meta-row">
                                                    Donations: <strong>{cause.donationCount ?? 0}</strong> &nbsp;·&nbsp;
                                                    Views: <strong>{viewMap[cause.id] || 0}</strong>
                                                </p>
                                                <div className="card-actions">
                                                    <button onClick={() => handleEditClick(cause)} className="edit-btn">Edit</button>
                                                    <button onClick={() => handleDelete(cause.id)} className="delete-btn">Delete</button>
                                                    {cause.status === 'PUBLISHED' && (
                                                        <button onClick={() => handleMarkCompleted(cause)} className="edit-btn">Complete</button>
                                                    )}
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
                            <StepBar currentId={currentId} formStep={formStep} />

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
                                            { label: 'Yourself', iconKey: 'yourself', desc: 'Funds go directly to your account for personal use' },
                                            { label: 'Someone Else', iconKey: 'someoneElse', desc: "You'll collect and distribute funds to a beneficiary" },
                                            { label: 'Charity', iconKey: 'charity', desc: 'Raise on behalf of a registered non-profit organization' },
                                        ].map(({ label, iconKey, desc }) => (
                                            <button
                                                className={`who-for-card ${formData.whoFor === label ? 'selected' : ''}`}
                                                key={label}
                                                onClick={() => handleWhoForSelect(label)}
                                                type="button"
                                            >
                                                <div className="icon-placeholder"><Icon name={iconKey} size={20} /></div>
                                                <div className="who-for-text">
                                                    <h3>{label}</h3>
                                                    <p>{desc}</p>
                                                </div>
                                            </button>
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
                                        <button className="back-link" onClick={handleBack}><ArrowLeftIcon />Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue<ArrowRightIcon /></button>
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
                                        {CATEGORIES.map(cat => {
                                            const categoryIconKey = {
                                                Health: 'health',
                                                Education: 'education',
                                                disaster: 'disaster',
                                                'community development': 'community',
                                                'children/youth': 'children',
                                                environment: 'environment',
                                                'animal welfare': 'animal',
                                                'sports/recreation': 'sports',
                                                'memorial/funeral': 'memorial',
                                                'others: state': 'others',
                                            }[cat] || 'others';

                                            return (
                                            <button
                                                key={cat}
                                                type="button"
                                                className={`category-tile ${formData.category === cat ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, category: cat }));
                                                    setStepError('');
                                                }}
                                            >
                                                <span className="category-tile-icon"><Icon name={categoryIconKey} size={20} /></span>
                                                <span className="category-tile-label">
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </span>
                                            </button>
                                            );
                                        })}
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}><ArrowLeftIcon />Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue<ArrowRightIcon /></button>
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
                                        <button className="back-link" onClick={handleBack}><ArrowLeftIcon />Back</button>
                                        <button className="next-btn" onClick={handleNext}>Continue<ArrowRightIcon /></button>
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
                                            <label htmlFor="step-image-url">
                                                Campaign Image URL
                                                {' '}<span className="label-optional">- optional</span>
                                            </label>
                                            <input
                                                id="step-image-url"
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
                                            <label htmlFor="step-story">Your Story</label>
                                            <textarea
                                                id="step-story"
                                                name="story"
                                                value={formData.story}
                                                onChange={handleChange}
                                                rows={9}
                                                placeholder="Why are you raising funds? What will the money be used for? Share your story honestly — people respond to real, heartfelt accounts."
                                            />
                                        </div>
                                    </div>

                                    <div className="step-nav">
                                        <button className="back-link" onClick={handleBack}><ArrowLeftIcon />Back</button>
                                        <button className="next-btn" onClick={handleNext}>Preview Campaign<ArrowRightIcon /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ── FLAT EDIT FORM ── */}
                    {view === 'edit' && (
                        <div className="fundraise-form-view">
                            <div className="edit-form-header">
                                <button className="back-link" onClick={() => { setCurrentId(null); setView('list'); }}><ArrowLeftIcon />Back</button>
                                <div>
                                    <p className="form-step-label">Editing Campaign</p>
                                    <h2>Edit Campaign Details</h2>
                                </div>
                            </div>

                            <form onSubmit={handleEditSubmit} className="fundraise-form">
                                <div className="form-group">
                                    <label htmlFor="edit-title">Campaign Title</label>
                                    <input
                                        id="edit-title"
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
                                        <label htmlFor="edit-category">Category</label>
                                        <select id="edit-category" name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="" disabled>Select a category</option>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="edit-goal">Donation Goal (₱)</label>
                                        <input
                                            id="edit-goal"
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
                                    <label htmlFor="edit-image-url">
                                        Campaign Image URL
                                        {' '}<span className="label-optional">- optional</span>
                                    </label>
                                    <input
                                        id="edit-image-url"
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
                                    <label htmlFor="edit-story">Your Story</label>
                                    <textarea
                                        id="edit-story"
                                        name="story"
                                        value={formData.story}
                                        onChange={handleChange}
                                        required
                                        rows={9}
                                        placeholder="Why are you raising funds? What will the money be used for?"
                                    />
                                </div>

                                <button type="submit" className="preview-btn">Preview Changes<ArrowRightIcon /></button>
                            </form>
                        </div>
                    )}


                    {view === 'preview' && (
                        <div className="preview-view">
                            <div className="preview-header">
                                <button className="back-link" onClick={() => currentId ? setView('edit') : (setView('steps'), setFormStep(5))}><ArrowLeftIcon />Back to Edit</button>
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

                            <div className="cause-meta" style={{ marginTop: '0.75rem' }}>
                                <span className="cause-author-meta">Donations: {currentId ? (myCampaigns.find(item => item.id === currentId)?.donationCount ?? 0) : 0}</span>
                                <span className="cause-author-meta">Views: {currentId ? (viewMap[currentId] || 0) : 0}</span>
                            </div>

                            <div className="publish-actions">
                                <button className="draft-btn" onClick={() => { if (currentId) bumpViewCount(currentId); handleSave('DRAFT'); }}>Save as Draft</button>
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