import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

const Experience = () => {
    const [isPastOpen, setIsPastOpen] = useState(false);

    const featured = workExperience.filter(e => e.featured);
    const past = workExperience.filter(e => !e.featured);

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

                {past.length > 0 && (
                    <div>
                        <button
                            onClick={() => setIsPastOpen(!isPastOpen)}
                            className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 uppercase transition-colors duration-200 flex items-center gap-2"
                        >
                            <span>Past Experience</span>
                            <ChevronDown className={`transition-transform duration-300 ${isPastOpen ? 'rotate-180' : ''}`} size={14} />
                        </button>

                        {isPastOpen && (
                            <div className="space-y-10 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                {past.map((e, i) => (
                                    <ExperienceItem
                                        key={i}
                                        title={e.role}
                                        date={e.period.replace(' - ', ' – ')}
                                        org={e.company}
                                        description={e.summary}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
