import React, { useState, useEffect, useRef } from 'react';
import SectionTitle from './SectionTitle';

const HoverItem = ({ label, children, tooltipClassName = "", onClickAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const itemRef = useRef(null);
    const touchTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemRef.current && !itemRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutside);
            if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        };
    }, []);

    const handleInteraction = (e) => {
        // Prevent default only if we are taking over the touch action entirely
        // but for iOS Safari we generally want the tap to go through so focus fires
        if (onClickAction) onClickAction();
        setIsOpen((prev) => !prev);
    };

    return (
        <button
            ref={itemRef}
            type="button"
            aria-expanded={isOpen}
            className={`relative inline-block ${onClickAction ? 'cursor-pointer' : 'cursor-help'} underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400`}
            onMouseEnter={() => {
                // Ignore mouse enter if we recently processed a touch event (fixes iOS double-firing)
                if (touchTimeoutRef.current) return;
                setIsOpen(true);
            }}
            onMouseLeave={() => {
                if (touchTimeoutRef.current) return;
                setIsOpen(false);
            }}
            onTouchStart={() => {
                // Set a flag that a touch started, clear it after a delay
                touchTimeoutRef.current = setTimeout(() => {
                    touchTimeoutRef.current = null;
                }, 500);
            }}
            onClick={handleInteraction}
        >
            <span>{label}</span>
            <div
                className={`transition-all duration-300 transform absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-xl pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100 ${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'
                    } ${tooltipClassName}`}
            >
                {children}
            </div>
        </button>
    );
};

const InterestWithMedia = ({ label, media }) => {
    const isVideo = media.endsWith('.mp4') || media.endsWith('.mov');

    return (
        <HoverItem label={label} tooltipClassName="min-w-[200px] px-2 py-2">
            {isVideo ? (
                <video
                    src={media}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-md object-cover block"
                />
            ) : (
                <img src={media} alt={label} className="w-full h-auto rounded-md object-cover block" />
            )}
        </HoverItem>
    );
};

const Interests = () => {
    return (
        <section className="mb-20">
            <SectionTitle title="Beyond Code" className="mb-6" />
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    <InterestWithMedia label="Rock Climbing" media="/rock-climb-compressed.mp4" />
                    <span>·</span>
                    <InterestWithMedia label="Cliff Jumping" media="/cliff-jump-compressed.mp4" />
                    <span>·</span>
                    <span>Hiking</span>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Weird things I like
                </h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-light">
                    <HoverItem
                        label="Web Browsers"
                        tooltipClassName="px-3 py-2 text-white dark:text-gray-900 text-xs text-center whitespace-nowrap w-max"
                    >
                        I like trying new web browsers.<br />My current favorite is <img src="/arc.png" alt="Arc" className="w-5 h-5 inline-block mx-1 align-middle" /> Arc Browser
                    </HoverItem>
                    <span>·</span>
                    <span>Credit Cards</span>
                    <span>·</span>
                    <HoverItem
                        label="IBM Plex Sans"
                        tooltipClassName="px-2 py-1 text-white dark:text-gray-900 text-xs whitespace-nowrap"
                        onClickAction={() => document.body.classList.toggle('ibm-plex-sans-theme')}
                    >
                        click me
                    </HoverItem>
                </div>
            </div>
        </section>
    );
};

export default Interests;
