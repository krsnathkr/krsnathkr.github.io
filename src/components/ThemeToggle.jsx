import React from 'react';
import { Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from './ThemeContext';
import useScrollFade from '../hooks/useScrollFade';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();
    const opacity = useScrollFade();

    const handleClick = (e) => {
        toggleTheme(e);
    };

    return (
        <button
            onClick={handleClick}
            data-haptic="success"
            className="fixed bottom-3 right-6 sm:bottom-6 z-50 p-2.5 rounded-full
                       bg-gray-100 dark:bg-gray-800
                       text-gray-600 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       transition-colors duration-200
                       shadow-sm hover:shadow-md"
            style={{ opacity, transition: 'opacity 0.3s ease, background-color 0.2s' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun size={18} weight="regular" />
            ) : (
                <Moon size={18} weight="regular" />
            )}
        </button>
    );
};

export default ThemeToggle;
