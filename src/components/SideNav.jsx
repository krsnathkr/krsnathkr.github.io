import React, { useState, useEffect, useCallback } from 'react';
import './SideNav.css';

const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'research', label: 'Research' },
    { id: 'work', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'techstack', label: 'Tech Stack' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'interests', label: 'Beyond Code' },
    { id: 'contact', label: 'Contact' },
];

const SideNav = ({ visible = true }) => {
    const [activeSection, setActiveSection] = useState('home');

    const handleScroll = useCallback(() => {
        const scrollPos = window.scrollY + window.innerHeight / 3;

        // Walk sections bottom-to-top so the *last* one whose top is above
        // the trigger line wins (gives us the "current" section).
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
            const el = document.getElementById(NAV_ITEMS[i].id);
            if (el && el.offsetTop <= scrollPos) {
                setActiveSection(NAV_ITEMS[i].id);
                return;
            }
        }
        setActiveSection('home');
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // set initial
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
    };

    if (!visible) return null;

    return (
        <nav className="side-nav" aria-label="Section navigation">
            <ul className="side-nav-list">
                {NAV_ITEMS.map(({ id, label }) => (
                    <li key={id}>
                        <button
                            onClick={() => scrollTo(id)}
                            className={`side-nav-link${activeSection === id ? ' active' : ''}`}
                            aria-current={activeSection === id ? 'true' : undefined}
                        >
                            <span className="side-nav-dot" />
                            <span className="side-nav-label">{label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideNav;
