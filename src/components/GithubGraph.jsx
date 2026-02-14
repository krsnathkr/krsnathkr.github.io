import React from 'react';

const GithubGraph = () => {
    return (
        <section className="mb-20">
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">GitHub Contributions</h2>
            <div className="overflow-x-auto pb-4">
                <img
                    src="https://ghchart.rshah.io/111111/krsnathkr"
                    alt="Krishna's Github Chart"
                    className="min-w-[600px] opacity-80 hover:opacity-100 transition-opacity"
                />
            </div>
            <div className="text-right text-xs text-gray-400 mt-2 font-mono">source: github.com/krsnathkr</div>
        </section>
    );
};

export default GithubGraph;
