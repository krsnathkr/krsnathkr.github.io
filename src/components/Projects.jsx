import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Projects = ({ onArchiveClick }) => {
    return (
        <section id="work" className="mb-20">
            <SectionTitle title="Projects" />

            <div className="space-y-10">
                {/* Project 1 */}
                <div className="group relative pl-6 border-l border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-300">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        <a href="https://github.com/krsnathkr/cheat-in-chess" target="_blank" rel="noopener noreferrer"
                            className="hover:underline decoration-1 underline-offset-4">StealthChess.AI</a>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {['OpenCV', 'YOLOv8', 'Stockfish'].map(tag => (
                            <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">
                        Real-time chess assistant analyzing live streams from Meta Ray-Ban glasses.
                    </p>
                </div>

                {/* Project 2 */}
                <div className="group relative pl-6 border-l border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-300">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        <a href="https://github.com/krsnathkr/rag-mcp-agenticAI" target="_blank" rel="noopener noreferrer"
                            className="hover:underline decoration-1 underline-offset-4">Knowbl Agentic RAG</a>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {['LangChain', 'OpenAI'].map(tag => (
                            <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">
                        Agentic RAG pipeline combining real-time web search and document Q&A.
                    </p>
                </div>

                {/* Project 3 */}
                <div className="group relative pl-6 border-l border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-300">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        <a href="https://github.com/anuragbhattarai31/EsportsWeb" target="_blank" rel="noopener noreferrer"
                            className="hover:underline decoration-1 underline-offset-4">SEMO Esports Platform</a>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {['React', 'Node.js', 'PostgreSQL'].map(tag => (
                            <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">
                        Full-stack booking system for 150+ students. Reduced congestion by 70%.
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <button
                    onClick={onArchiveClick}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                >
                    View Full Project Archive <ArrowRight size={12} className="ml-1.5" />
                </button>
            </div>
        </section>
    );
};

export default Projects;
