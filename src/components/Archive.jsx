import React, { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Archive = ({ onBack }) => {
    const [filter, setFilter] = useState('All');

    const projects = [
        { name: 'StealthChess.AI', category: 'AI/ML', builtWith: 'OpenCV, YOLOv8', link: 'https://github.com/krsnathkr/cheat-in-chess' },
        { name: 'Knowbl Agentic RAG', category: 'AI/ML', builtWith: 'LangChain, OpenAI', link: 'https://github.com/krsnathkr/rag-mcp-agenticAI' },
        { name: 'ASA DataFest Winner', category: 'Data', builtWith: 'R, Random Forest', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7315084829555847168/' },
        { name: 'Medi-Compare', category: 'Data', builtWith: 'Healthcare, Data', link: 'https://www.linkedin.com/posts/krsnathkr_this-weekend-was-intense-in-the-best-way-activity-7396238223242551296-pQFl' },
        { name: 'Sales Data Pipeline', category: 'Data', builtWith: 'Azure, dbt, Spark', link: 'https://github.com/krsnathkr/dataPipeline' },
        { name: 'SEMO Esports Platform', category: 'Web Dev', builtWith: 'React, Node, PG', link: 'https://github.com/anuragbhattarai31/EsportsWeb' },
        { name: 'Echo Chamber', category: 'AI/ML', builtWith: 'Python, Streamlit', link: 'https://github.com/krsnathkr/NewsML' },
        { name: 'Market Radar', category: 'AI/ML', builtWith: 'Gemini API', link: 'https://stockmarketinsights.streamlit.app/' },
        { name: 'Penny Planner', category: 'AI/ML', builtWith: 'OpenAI API, Plotly', link: 'https://github.com/krsnathkr/finance-assistant' },
        { name: 'Titanic Predictor', category: 'AI/ML', builtWith: 'Scikit-learn', link: 'https://github.com/krsnathkr/TitanicMLprediction' },
        { name: 'NY Housing Analysis', category: 'Data', builtWith: 'Python, Plotly', link: 'https://github.com/krsnathkr/NYHousingPrices' },
        { name: 'Tic-Tac-Toe', category: 'Web Dev', builtWith: 'JS, HTML/CSS', link: 'https://github.com/krsnathkr/Tic-Tac-toe' },
        { name: 'Multi-Port Server', category: 'Web Dev', builtWith: 'Flask, Socket', link: 'https://github.com/krsnathkr/FlaskMessagingSystem' },
        { name: 'Yelp Review Study', category: 'Research', builtWith: 'NLP, RoBERTa', link: 'https://github.com/Abusheha80/Student-Research-Conference-Natural-Language-Processing' },
    ];

    const categories = ['All', ...new Set(projects.map(project => project.category))];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(project => project.category === filter);

    return (
        <div id="archive-view" className="animate-in fade-in duration-500">
            <button
                onClick={onBack}
                className="mb-12 group flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="transform group-hover:-translate-x-1 transition-transform" size={16} />
                Back to Portfolio
            </button>

            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
                All Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 font-light">
                A complete list of things I've built, researched, or broken.
            </p>

            <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`text-sm whitespace-nowrap transition-colors ${filter === category
                            ? 'text-black dark:text-white font-semibold'
                            : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-4 pr-4 font-bold w-1/4">Project</th>
                            <th className="py-4 px-4 font-bold hidden md:table-cell w-1/6">Category</th>
                            <th className="py-4 px-4 font-bold hidden md:table-cell w-1/3">Built With</th>
                            <th className="py-4 pl-4 font-bold w-1/6 text-right">Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
                        {filteredProjects.map((project, index) => (
                            <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="py-4 pr-4 font-medium text-black dark:text-white">{project.name}</td>
                                <td className="py-4 px-4 hidden md:table-cell">{project.category}</td>
                                <td className="py-4 px-4 hidden md:table-cell font-mono text-xs text-gray-500 dark:text-gray-400">{project.builtWith}</td>
                                <td className="py-4 pl-4 text-right">
                                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                                        className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:underline inline-block">
                                        <ExternalLink size={14} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Archive;
