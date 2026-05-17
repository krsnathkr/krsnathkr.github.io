import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';
import projectsData from '../data/projects.json';

const featuredProjects = projectsData.filter(p => p.featured);

const Projects = ({ onArchiveClick }) => {
    return (
        <section id="work" className="mb-20">
            <SectionTitle title="Projects" />

            <div className="space-y-10">
                {featuredProjects.map(project => (
                    <div key={project.id} className="group relative pl-6 border-l border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-300">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                                className="hover:underline decoration-1 underline-offset-4">{project.title}</a>
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {project.tags.map(tag => (
                                <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">
                            {project.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <button
                    onClick={onArchiveClick}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                >
                    All Projects <ArrowRight size={12} className="ml-1.5" />
                </button>
            </div>
        </section>
    );
};

export default Projects;
