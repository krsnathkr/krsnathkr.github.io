import React from 'react';
import { GithubLogo, LinkedinLogo, Envelope, Eye } from '@phosphor-icons/react';
import profilePhoto from '../assets/profilephoto.png';

const Hero = () => {
    return (
        <header id="home" className="mb-20 flex flex-col items-center text-center">
            <div className="relative w-64 h-80 mb-8 overflow-hidden">
                <img
                    src={profilePhoto}
                    alt="Krishna Thakar"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                    }}
                />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
                Krishna Thakar
            </h1>
            <p className="text-base text-gray-400 dark:text-gray-500 mb-8">
                Masters in CS · Data Engineer · ML Researcher
            </p>

            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4 max-w-xl">
                I currently work as a Data Engineer Intern at Pubgen.ai, a web developer for my university, and a deep learning researcher with my professor — all at once.
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8 max-w-xl">
                I am working toward becoming an ML engineer or data scientist/engineer, with the goal of building intelligent solutions that are not just theoretically strong, but practical and ready for real-world use.
            </p>

            {/* Social Links */}
            <div className="flex gap-5 text-gray-400 dark:text-gray-500">
                <a href="https://github.com/krsnathkr/" target="_blank" rel="noopener noreferrer"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <GithubLogo size={24} />
                </a>
                <a href="https://www.linkedin.com/in/krsnathkr/" target="_blank" rel="noopener noreferrer"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <LinkedinLogo size={24} />
                </a>
                <a href="https://scholar.google.com/citations?user=Mm_G5sQAAAAJ&hl=en" target="_blank" rel="noopener noreferrer"
                    aria-label="Google Scholar" title="Google Scholar"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                    </svg>
                </a>
                <a href="mailto:krsnathkr@gmail.com"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <Envelope size={24} />
                </a>
            </div>

            {/* View CV Button */}
            <a
                href="https://drive.google.com/file/d/1J3MN3buyW_y5cFZQrelqnGPH7AXjGCOB/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                id="view-cv-btn"
                className="resume-btn group"
            >
                <span className="resume-btn-shimmer" />
                <Eye size={16} className="resume-btn-icon" />
                <span className="resume-btn-text">View my CV</span>
            </a>

            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">Open to Relocation · Available Worldwide</p>
        </header>
    );
};

export default Hero;
