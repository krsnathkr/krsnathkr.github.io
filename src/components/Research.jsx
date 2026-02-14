import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Research = () => {
    return (
        <section id="research" className="mb-20">
            <SectionTitle title="Research" />

            <div className="space-y-10">
                <div className="group">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Comparative Study</span>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                <a href="https://github.com/Abusheha80/Student-Research-Conference-Natural-Language-Processing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline decoration-1 underline-offset-4">
                                    Sentiment Analysis of Yelp Review Dataset
                                </a>
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2 leading-relaxed">
                                Investigated effectiveness of SVM, Random Forest vs CNN, BILSTM, and RoBERTa.
                            </p>
                        </div>
                        <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors mt-5 shrink-0" size={16} />
                    </div>
                </div>

                <div className="group">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ethics Paper</span>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                <a href="https://www.linkedin.com/posts/krsnathkr_i-recently-had-the-amazing-opportunity-to-activity-7189376764937232384-uRCu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline decoration-1 underline-offset-4">
                                    From War Machine to Peacemaker: Duality of AI
                                </a>
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2 leading-relaxed">
                                Explored ethical concerns of autonomous weapons vs AI in peace negotiations.
                            </p>
                        </div>
                        <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors mt-5 shrink-0" size={16} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Research;
