import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import shapeLanding from '../assets/shape-landing.png';
import './landing.css';

const features = [
    {
        id: 1,
        text: 'Lorem ipsum dolor sit amet. consectetur',
    },
    {
        id: 2,
        text: 'Lorem ipsum dolor sit amet. consectetur',
    },
    {
        id: 3,
        text: 'Lorem ipsum dolor sit amet. consectetur',
    },
    {
        id: 4,
        text: 'Lorem ipsum dolor sit amet. consectetur',
    },
    {
        id: 5,
        text: 'Lorem ipsum dolor sit amet. consectetur',
    },
];

const Landing = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const aboutRef = useRef(null);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Carousel navigation
    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    // Get visible cards (3 at a time)
    const getVisibleCards = () => {
        const total = features.length;
        const prevIdx = (activeIndex - 1 + total) % total;
        const nextIdx = (activeIndex + 1) % total;
        return [prevIdx, activeIndex, nextIdx];
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToAbout = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const visibleCards = getVisibleCards();

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`} id="landing-navbar">
                <button className="navbar-logo" onClick={scrollToTop} type="button">
                    Altru
                </button>
                <div className="navbar-links">
                    <a href="#home" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                        Home
                    </a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollToAbout(); }}>
                        About
                    </a>
                    <a href="#more" onClick={(e) => { e.preventDefault(); }}>
                        More
                    </a>
                    <button
                        className="navbar-auth-btn"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="navbar-auth-btn"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                className="hero-section"
                id="home"
                ref={heroRef}
                style={{ backgroundImage: `url(${shapeLanding})` }}
            >
                <div className="hero-content">
                    <h1 className="hero-title">
                        Lorem ipsum dolor sit amet. consectetur
                    </h1>
                    <p className="hero-subtitle">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary"
                            id="get-started-btn"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </button>
                        <button
                            className="btn-secondary"
                            id="learn-more-btn"
                            onClick={scrollToAbout}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="about" ref={aboutRef}>
                <div className="about-label">About</div>
                <div className="carousel-wrapper">
                    <button
                        className="carousel-arrow"
                        id="carousel-prev"
                        onClick={handlePrev}
                        aria-label="Previous feature"
                    >
                        ←
                    </button>

                    <div className="carousel-track">
                        {visibleCards.map((cardIndex, i) => (
                            <div
                                className={`carousel-card ${cardIndex === activeIndex ? 'active' : ''}`}
                                key={`${features[cardIndex].id}-${i}`}
                            >
                                <div className="carousel-card-image">
                                    <div className="carousel-card-image-inner" />
                                </div>
                                <p className="carousel-card-text">
                                    {features[cardIndex].text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-arrow"
                        id="carousel-next"
                        onClick={handleNext}
                        aria-label="Next feature"
                    >
                        →
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Landing;