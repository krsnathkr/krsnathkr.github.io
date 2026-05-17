import React from 'react';
import SectionTitle from './SectionTitle';
import achievementsData from '../data/achievements.json';

const Achievements = () => {
    return (
        <section id="achievements" className="mb-20">
            <SectionTitle title="Achievements" />

            <div className="space-y-8">
                {achievementsData.map(item => (
                    <div key={item.id} className="group">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                                {item.title}
                            </h3>
                            <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">{item.period}</span>
                        </div>
                        {item.desc && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                {item.desc}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievements;
