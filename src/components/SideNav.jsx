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

const getActiveSection = () => {
    if (typeof window === 'undefined') return 'home';

    const triggerLine = 120;
    let activeSection = 'home';

    for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine) {
            activeSection = id;
        }

        if (rect.top <= triggerLine && rect.bottom > triggerLine) {
            return id;
        }
    }

    return activeSection;
};

const SideNav = ({ visible = true }) => {
    const [activeSection, setActiveSection] = useState(getActiveSection);

    const handleScroll = useCallback(() => {
        setActiveSection(getActiveSection());
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            setActiveSection(id);
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
