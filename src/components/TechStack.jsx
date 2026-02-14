import React from 'react';
import SectionTitle from './SectionTitle';

const TechStack = () => {
    const stack = [
        'Python', 'TensorFlow', 'React', 'SQL', 'Docker', 'Kubernetes',
        'Spark', 'RAG LLM', 'Hugging Face', 'MongoDB', 'Databricks', 'Snowflake'
    ];

    return (
        <section className="mb-20">
            <SectionTitle title="Tech Stack" />
            <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300 cursor-default"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TechStack;
