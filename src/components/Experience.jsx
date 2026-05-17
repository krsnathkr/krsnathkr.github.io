import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';
import workExperience from '../data/work_experience.json';

const ExperienceItem = ({ title, date, org, description }) => (
    <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <span className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 md:mt-0">{date}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{org}</div>
        <p className="text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">{description}</p>
    </div>
);

const Experience = ({ onFullResumeClick }) => {
    const featured = workExperience.filter(e => e.featured);

    return (
        <section id="experience" className="mb-20">
            <SectionTitle title="Experience" />

            <div className="space-y-10">
                {featured.map((e, i) => (
                    <ExperienceItem
                        key={i}
                        title={e.role}
                        date={e.period.replace(' - ', ' – ')}
                        org={e.company}
                        description={e.summary}
                    />
                ))}
            </div>

            <div className="mt-10">
                <button
                    onClick={onFullResumeClick}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                >
                    All Experience <ArrowRight size={12} className="ml-1.5" />
                </button>
            </div>
        </section>
    );
};

export default Experience;
