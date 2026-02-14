import React from 'react';

const Colophon = () => {
    const toggleFont = () => {
        document.body.classList.toggle('use-ibm-font');
    };

    return (
        <section className="mb-20">
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">Colophon</h2>
            <div className="p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-600 font-light italic">
                    "My favorite font is&nbsp;
                    <button
                        onClick={toggleFont}
                        className="font-medium text-black not-italic hover:underline decoration-wavy decoration-gray-400 cursor-pointer focus:outline-none"
                        title="Click to switch site font"
                    >
                        IBM Plex Sans
                    </button>."
                </p>
            </div>
        </section>
    );
};

export default Colophon;
