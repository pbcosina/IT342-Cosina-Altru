import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import shapeLanding from '../../../assets/shape-landing.png';
import '../styles/landing.css';

const features = [
    {
        id: 1,
        icon: '🌿',
        title: 'Unified Cross-Platform Access',
        text: 'Seamlessly transition from desktop to mobile. Our web and native Android apps stay perfectly synced.',
    },
    {
        id: 2,
        icon: '✦',
        title: 'Radical Transparency',
        text: 'See live tracking of donation goals and progress. Know exactly where your support goes instantly.',
    },
    {
        id: 3,
        icon: '◎',
        title: 'Effortless Fundraising',
        text: 'Turn your purpose into action in minutes. Build, preview, and launch your campaign with ease.',
    },
    {
        id: 4,
        icon: '⬡',
        title: 'Secure Data Protection',
        text: 'Trust is our core architecture. Robust authentication keeps your data and transactions safe.',
    },
    {
        id: 5,
        icon: '⟡',
        title: 'Intentional Discovery',
        text: 'Find the causes that matter to you. Clean layout options make exploration straightforward.',
    },
];

const Landing = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const [slideDir, setSlideDir] = useState(null);
    const navigate = useNavigate();
    const aboutRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const go = (dir) => {
        if (transitioning) return;
        setSlideDir(dir);
        setTransitioning(true);
        setTimeout(() => {
            setActiveIndex((prev) =>
                dir === 'next'
                    ? (prev + 1) % features.length
                    : (prev - 1 + features.length) % features.length
            );
            setTransitioning(false);
            setSlideDir(null);
        }, 350);
    };

    const jumpTo = (i) => {
        if (i === activeIndex || transitioning) return;
        setSlideDir(i > activeIndex ? 'next' : 'prev');
        setTransitioning(true);
        setTimeout(() => {
            setActiveIndex(i);
            setTransitioning(false);
            setSlideDir(null);
        }, 350);
    };

    const getVisibleCards = () => {
        const total = features.length;
        return [
            (activeIndex - 1 + total) % total,
            activeIndex,
            (activeIndex + 1) % total,
        ];
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' });

    const visibleCards = getVisibleCards();

    return (
        <div className="landing-page">

            {/* ── Navbar ── */}
            <nav className={`landing-navbar ${scrolled ? 'nav-scrolled' : 'nav-top'}`}>
                <button className="navbar-logo" onClick={scrollToTop} type="button">
                    Altru
                </button>
                <div className="navbar-links">
                    <a href="#home" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>Home</a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollToAbout(); }}>About</a>
                    <a href="#more" onClick={(e) => e.preventDefault()}>More</a>
                    <div className="nav-auth-group">
                        <button className="nav-btn-outline" onClick={() => navigate('/login')}>Login</button>
                        <button className="nav-btn-fill" onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section
                className="hero-section"
                id="home"
                style={{ backgroundImage: `url(${shapeLanding})` }}
            >
                <div className="hero-blob hero-blob-a" />
                <div className="hero-blob hero-blob-b" />

                <p className="hero-eyebrow">
                    <span className="eyebrow-dot" />
                    Altru: Where Compassion Meets Clarity
                </p>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Give more.<br />
                        <em>Together.</em>
                    </h1>
                    <p className="hero-subtitle">
                        Altru connects generous people with causes that need them most.
                        Discover, donate, and make a lasting difference — all in one place.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate('/register')}>
                            Get Started
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="btn-ghost" onClick={scrollToAbout}>
                            Learn More
                        </button>
                    </div>
                </div>

                <button className="scroll-nudge" onClick={scrollToAbout} aria-label="Scroll down">
                    <span className="nudge-label">Scroll</span>
                    <span className="nudge-line" />
                </button>
            </section>

            {/* ── About / Carousel ── */}
            <section className="about-section" id="about" ref={aboutRef}>
                <div className="section-intro">
                    <span className="section-tag">What We Offer</span>
                    <h2 className="section-title">Built around what matters</h2>
                    <p className="section-desc">
                        Every feature is designed with one goal — to make giving as easy,
                        transparent, and impactful as possible.
                    </p>
                </div>

                <div className="carousel-shell">
                    <button className="c-arrow" onClick={() => go('prev')} aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className={`carousel-track ${transitioning ? `exit-${slideDir}` : ''}`}>
                        {visibleCards.map((cardIdx, pos) => {
                            const isActive = cardIdx === activeIndex;
                            return (
                                <div
                                    key={`${features[cardIdx].id}-${pos}`}
                                    className={`c-card ${isActive ? 'c-active' : 'c-side'}`}
                                    onClick={() => {
                                        if (!isActive) pos === 0 ? go('prev') : go('next');
                                    }}
                                >
                                    <div className="c-icon-ring">
                                        <span className="c-icon">{features[cardIdx].icon}</span>
                                    </div>
                                    <h3 className="c-title">{features[cardIdx].title}</h3>
                                    <p className="c-text">{features[cardIdx].text}</p>
                                </div>
                            );
                        })}
                    </div>

                    <button className="c-arrow" onClick={() => go('next')} aria-label="Next">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="c-dots" role="tablist">
                    {features.map((_, i) => (
                        <button
                            key={i}
                            role="tab"
                            aria-selected={i === activeIndex}
                            className={`c-dot ${i === activeIndex ? 'dot-active' : ''}`}
                            onClick={() => jumpTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
                <div className="cta-glow" />
                <h2 className="cta-title">Ready to make an impact?</h2>
                <p className="cta-desc">
                    Join thousands of people already changing lives through Altru.
                </p>
                <button className="btn-cta" onClick={() => navigate('/register')}>
                    Create Your Account
                </button>
            </section>

            {/* ── Footer ── */}
            <footer className="site-footer">
                <span className="footer-logo">Altru</span>
                <span className="footer-copy">© {new Date().getFullYear()} Altru. All rights reserved.</span>
            </footer>

        </div>
    );
};

export default Landing;