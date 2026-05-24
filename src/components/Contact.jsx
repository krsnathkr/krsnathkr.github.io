import React from 'react';
import { Eye } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';

const Contact = () => {
    return (
        <section id="contact" className="mb-20">
            <SectionTitle title="Get in Touch" className="mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                Connect with me on{' '}
                <a
                    href="https://www.linkedin.com/in/krsnathkr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block underline-wavy-animated wavy-clip-content py-0.5 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                >
                    LinkedIn
                </a>
                {' '}or shoot an{' '}
                <a
                    href="mailto:krsnathkr@gmail.com"
                    className="inline-block underline-wavy-animated wavy-clip-content py-0.5 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                >
                    email
                </a>
                .
            </p>
            <a
                href="https://drive.google.com/file/d/1LFj0m0om7W7IzUUA6dcyLbfQaTqRVD8y/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-view-cv"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed underline-wavy-animated wavy-clip-content py-0.5 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
            >
                <Eye size={14} />
                View my CV [ again ;) ]
            </a>
        </section>
    );
};

export default Contact;
