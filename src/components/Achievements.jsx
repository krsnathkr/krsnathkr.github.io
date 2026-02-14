import React from 'react';
import SectionTitle from './SectionTitle';

const Achievements = () => {
    return (
        <section id="achievements" className="mb-20">
            <SectionTitle title="Achievements" />

            <div className="space-y-8">
                {/* Wall of Fame */}
                <div className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Math Department Wall
                        </h3>
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">Honored</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        My name hangs on the wall of the SEMO Math Department <span className="italic text-gray-400 dark:text-gray-500">(woohoo! check out the photos above)</span>
                    </div>
                </div>

                {/* International Excellence Award */}
                <div className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                            International Excellence Award
                        </h3>
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">2021 – 2025</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        50% scholarship at SEMO · Awarded 4 times in 4 years
                    </div>
                </div>

                {/* Dean's List & President's List */}
                <div className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Dean's List & President's List
                        </h3>
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">2022 – 2024</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        Dean's List (6 semesters) · President's List (5 semesters)
                    </div>
                </div>

                {/* Graphic Designer */}
                <div className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Graphic Designer
                        </h3>
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">2022 – 2025</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        International Student Association
                    </div>
                </div>

                {/* First Year Leadership */}
                <div className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                            First Year Leadership Program
                        </h3>
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1 sm:mt-0">2022</span>
                    </div>

                </div>


            </div>
        </section>
    );
};

export default Achievements;
