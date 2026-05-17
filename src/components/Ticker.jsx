import React from 'react';
import highlights from '../data/highlights.json';

const TickerItem = ({ item, 'aria-hidden': ariaHidden }) => (
    <span className="flex items-center" aria-hidden={ariaHidden}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-4 flex-shrink-0" />
        {item.url ? (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={ariaHidden === "true" ? -1 : 0}
                className="text-sm font-light text-gray-600 dark:text-gray-400 hover:underline"
            >
                {item.text}
            </a>
        ) : (
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                {item.text}
            </span>
        )}
        <span className="mx-4 text-gray-400 dark:text-gray-600">·</span>
    </span>
);

const Ticker = () => {
    if (highlights.length === 0) return null;

    const duration = `${highlights.length * 8}s`;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800">
            <div
                className="flex whitespace-nowrap animate-marquee"
                style={{ '--marquee-duration': duration }}
            >
                {highlights.map((item, i) => (
                    <TickerItem key={`a-${i}`} item={item} />
                ))}
                {highlights.map((item, i) => (
                    <TickerItem key={`b-${i}`} item={item} aria-hidden="true" />
                ))}
            </div>
        </div>
    );
};

export default Ticker;
