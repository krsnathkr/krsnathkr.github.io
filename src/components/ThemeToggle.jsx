import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-2.5 rounded-full
                       bg-gray-100 dark:bg-gray-800
                       text-gray-600 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       transition-colors duration-200
                       shadow-sm hover:shadow-md"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun size={18} strokeWidth={1.8} />
            ) : (
                <Moon size={18} strokeWidth={1.8} />
            )}
        </button>
    );
};

export default ThemeToggle;
