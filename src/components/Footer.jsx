import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center text-sm text-gray-300 dark:text-gray-600 font-light pt-8 border-t border-gray-100 dark:border-gray-800 pb-24">
            <div>&copy; {new Date().getFullYear()} Krishna Thakar</div>
        </footer>
    );
};

export default Footer;
