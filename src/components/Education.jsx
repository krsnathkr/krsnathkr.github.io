import React from 'react';
import SectionTitle from './SectionTitle';

const Education = () => {
    return (
        <section id="education" className="mb-20">
            <SectionTitle title="Education" />

            <div className="space-y-8">
                <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-100 rounded-full -left-[5px] top-1.5"></div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Master of Science, Computer Science</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Southeast Missouri State University · <span className="text-gray-900 dark:text-gray-100 font-medium">4.0 GPA</span>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">2025 – 2027</div>
                </div>

                <div className="border-l-2 border-gray-100 dark:border-gray-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full -left-[5px] top-1.5"></div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Bachelor of Science, Computer Science</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Southeast Missouri State University · <span className="text-gray-900 dark:text-gray-100 font-medium">3.9 GPA</span>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">2021 – 2025</div>
                </div>
            </div>
        </section>
    );
};

export default Education;
