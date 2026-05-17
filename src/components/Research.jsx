import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';
import researchData from '../data/research.json';

const Research = () => {
    return (
        <section id="research" className="mb-20">
            <SectionTitle title="Research" />

            <div className="space-y-10">
                {[...researchData].sort((a, b) => b.id - a.id).map(item => (
                    <div key={item.id} className="group">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.label}</span>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                                        className="hover:underline decoration-1 underline-offset-4">
                                        {item.title}
                                    </a>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2 leading-relaxed">
                                    {item.desc}
                                </p>
                                {item.contributors.map((c, i) => (
                                    <p key={i} className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        {c.role}: {c.name}
                                    </p>
                                ))}
                            </div>
                            <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors mt-5 shrink-0" size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Research;
