import React from 'react';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';
import projectsData from '../data/projects.json';

const featuredProjects = projectsData.filter(p => p.featured);

const Projects = ({ onArchiveClick }) => {
    return (
        <section id="work" className="mb-20">
            <SectionTitle title="Projects" />

            <div className="space-y-10">
                {featuredProjects.map(project => (
                    <div key={project.id} className={`relative ${project.link ? 'group' : ''}`}>
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={project.title} />
                        )}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    <span className={project.link ? 'inline-block group-hover-underline-wavy-animated' : 'inline-block'}>{project.title}</span>
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
                            {project.link && (
                                <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors mt-1 shrink-0" size={16} />
                            )}
                        </div>
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
