import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionTitle from './SectionTitle';

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

    return (
        <section id="experience" className="mb-20">
            <SectionTitle title="Experience" />

            <div className="space-y-10">
                <ExperienceItem
                    title="GA Web Developer"
                    date="Aug 2025 – Present"
                    org="Southeast Missouri State University"
                    description={
                        <>
                            Developing reusable web components and custom page templates while maintaining the official university website, <a href="https://semo.edu/" target="_blank" rel="noopener noreferrer" className="underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200">semo.edu</a>.
                        </>
                    }
                />

                <ExperienceItem
                    title="Founder / VP"
                    date="Sep 2025 – Present"
                    org="Hacklabs SEMO"
                    description="Organizing student teams for hackathons at regional and national competitions. Building connections with industry professionals to support members' career growth."
                />

                <ExperienceItem
                    title="Machine Learning Researcher"
                    date="Jan 2025 – May 2025"
                    org="SEMO Department of Computer Science"
                    description="Worked with Dr. Abu and Dr. Thompson to conduct a comparative analysis of ML and Deep Learning models on ~7 million Yelp reviews. Demonstrated that fine-tuned RoBERTa achieved top performance (accuracy 0.80112) through systematic cross-validation."
                />

                {/* Show More Toggle */}
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
                            <ExperienceItem
                                title="Resident Assistant"
                                date="Jan 2023 – May 2025"
                                org="Southeast Missouri State University"
                                description="Mentored 100+ residents and organized campus events to foster a supportive and inclusive community."
                            />
                            <ExperienceItem
                                title="Information Technology Staff"
                                date="Sep 2023 – Jan 2025"
                                org="SEMO IT"
                                description="Provided technical support to 100+ users and managed IT inventory for SEMO IT."
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience;
