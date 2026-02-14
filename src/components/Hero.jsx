import React from 'react';
import { Github, Linkedin, Mail, Eye } from 'lucide-react';
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
                Masters in CS · Web Developer · ML Researcher
            </p>

            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4 max-w-xl">
                I currently work as a web developer for my university, building real systems that students use every day, while also conducting machine-learning research with faculty.
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8 max-w-xl">
                I am working toward becoming a machine learning engineer or data scientist, with the goal of building intelligent solutions that are not just theoretically strong, but practical and ready for real world use.
            </p>

            {/* Social Links */}
            <div className="flex gap-5 text-gray-400 dark:text-gray-500">
                <a href="https://github.com/krsnathkr/" target="_blank" rel="noopener noreferrer"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/krsnathkr/" target="_blank" rel="noopener noreferrer"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <Linkedin size={24} />
                </a>
                <a href="mailto:krsnathkr@gmail.com"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    <Mail size={24} />
                </a>
            </div>

            {/* View CV Button */}
            <a
                href="https://drive.google.com/file/d/1rm9oKMQoc6rR0Uo73gnRGb55o90ZkbdP/view?usp=sharing"
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
