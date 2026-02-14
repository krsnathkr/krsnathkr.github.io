import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const toggleRef = useRef(null);

    // Apply dark class on mount and changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = useCallback((event) => {
        // Get coordinates from the toggle button click
        const x = event?.clientX ?? window.innerWidth - 40;
        const y = event?.clientY ?? 20;

        // Set CSS custom properties for the animation origin
        document.documentElement.style.setProperty('--toggle-x', `${x}px`);
        document.documentElement.style.setProperty('--toggle-y', `${y}px`);

        // Use View Transition API if available
        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                setIsDark(prev => !prev);
            });
        } else {
            // Fallback: instant toggle
            setIsDark(prev => !prev);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, toggleRef }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
