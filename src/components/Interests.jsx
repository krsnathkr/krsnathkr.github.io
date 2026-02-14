import React from 'react';
import SectionTitle from './SectionTitle';

const InterestWithMedia = ({ label, media }) => {
    const isVideo = media.endsWith('.mp4') || media.endsWith('.mov');

    return (
        <div className="group relative inline-block cursor-help underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black">
            <span>{label}</span>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-2 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-xl pointer-events-none z-50 min-w-[200px] after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100">
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
            </div>
        </div>
    );
};

const Interests = () => {
    return (
        <section className="mb-20">
            <SectionTitle title="Beyond Code" className="mb-6" />
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    <InterestWithMedia label="Rock Climbing" media="/rock-climb.mp4" />
                    <span>·</span>
                    <InterestWithMedia label="Cliff Jumping" media="/cliff-jump.mov" />
                    <span>·</span>
                    <span>Hiking</span>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Weird things I like
                </h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-light">
                    <div className="group relative inline-block cursor-help underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black">
                        <span>Web Browsers</span>
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-xl pointer-events-none text-center whitespace-nowrap w-max z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100">
                            I like trying new web browsers.<br />My current favorite is <img src="/arc.png" alt="Arc" className="w-5 h-5 inline-block mx-1 align-middle" /> Arc Browser
                        </div>
                    </div>
                    <span>·</span>
                    <span>Credit Cards</span>
                    <span>·</span>
                    <div
                        className="group relative inline-block cursor-pointer underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black"
                        onClick={() => document.body.classList.toggle('ibm-plex-sans-theme')}
                    >
                        <span>IBM Plex Sans</span>
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100">
                            click me
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Interests;
