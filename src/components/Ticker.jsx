import React, { useState } from 'react';
import highlights from '../data/highlights.json';

const Ticker = () => {
    const [paused, setPaused] = useState(false);

    if (highlights.length === 0) return null;

    const items = [...highlights, ...highlights];
    const duration = `${highlights.length * 8}s`;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-9 flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800">
            <div
                className="flex whitespace-nowrap animate-marquee"
                style={{
                    '--marquee-duration': duration,
                    animationPlayState: paused ? 'paused' : 'running',
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {items.map((item, i) => (
                    <span key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-4 flex-shrink-0" />
                        {item.url ? (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
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
                ))}
            </div>
        </div>
    );
};

export default Ticker;
