import React from 'react';
import { Eye } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Contact = () => {
    return (
        <section className="mb-20">
            <SectionTitle title="Get in Touch" className="mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                Connect with me on{' '}
                <a
                    href="https://www.linkedin.com/in/krsnathkr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 transition-all duration-200"
                >
                    LinkedIn
                </a>
                {' '}or shoot an{' '}
                <a
                    href="mailto:krsnathkr@gmail.com"
                    className="underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 transition-all duration-200"
                >
                    email
                </a>
                .
            </p>
            <a
                href="https://drive.google.com/file/d/1rm9oKMQoc6rR0Uo73gnRGb55o90ZkbdP/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-view-cv"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-gray-500 dark:text-gray-400 font-light underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 transition-all duration-200"
            >
                <Eye size={14} />
                View my CV [ again ;) ]
            </a>
        </section>
    );
};

export default Contact;
