import React from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import workExperience from '../data/work_experience.json';

const ExperienceArchive = ({ onBack }) => {
    const featured = workExperience.filter(e => e.featured);
    const past = workExperience.filter(e => !e.featured);

    const Entry = ({ entry }) => (
        <div className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{entry.role}</h3>
                <span className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 md:mt-0 shrink-0">
                    {entry.period.replace(' - ', ' – ')}
                </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{entry.company}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-3">{entry.summary}</p>
            <ul className="space-y-1.5">
                {entry.points.map((point, i) => (
                    <li key={i} className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed flex gap-2">
                        <span className="mt-0.5 shrink-0">·</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <button
                onClick={onBack}
                className="mb-12 group flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="transform group-hover:-translate-x-1 transition-transform" size={16} />
                Back to Portfolio
            </button>

            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
                Work Experience
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12 font-light">
                Every role, every lesson.
            </p>

            <div>
                {featured.map((entry, i) => <Entry key={i} entry={entry} />)}
            </div>

            {past.length > 0 && (
                <>
                    <div className="flex items-center gap-4 my-4">
                        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-300 dark:text-gray-600">Past</span>
                        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
                    </div>
                    <div>
                        {past.map((entry, i) => <Entry key={i} entry={entry} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExperienceArchive;
