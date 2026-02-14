import React from 'react';

const SectionTitle = ({ title, subtitle, className = "mb-10" }) => {
    return (
        <div className={className}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-light">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionTitle;
