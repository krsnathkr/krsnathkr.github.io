import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import SectionTitle from './SectionTitle';
import researchData from '../data/research.json';
import aclLightSticker from '../assets/acl-light-sticker.png';
import aclDarkSticker from '../assets/acl-dark-sticker.png';
import { useTheme } from './ThemeContext';
import StickerPeel from './StickerPeel';

const ACL_STICKER_RESEARCH_ID = 2;

const Research = () => {
    const { isDark } = useTheme();
    return (
        <section id="research" className="mb-20">
            <SectionTitle title="Research" />

            <div className="space-y-10">
                {[...researchData].sort((a, b) => b.id - a.id).map(item => (
                    <div
                        key={item.id}
                        className={`${item.link ? 'group ' : ''}relative ${item.id === ACL_STICKER_RESEARCH_ID ? 'acl-sticker-target pr-0 sm:pr-36' : ''}`}
                    >
                        {item.id === ACL_STICKER_RESEARCH_ID && (
                            <div className="acl-sticker-paste" aria-label="ACL sticker">
                                <StickerPeel
                                    imageSrc={isDark ? aclDarkSticker : aclLightSticker}
                                    width={120}
                                    rotate={-15}
                                    peelBackHoverPct={22}
                                    peelBackActivePct={36}
                                    shadowIntensity={0.5}
                                    lightingIntensity={0.05}
                                    draggable={false}
                                />
                            </div>
                        )}
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={item.title} />
                        )}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.label}</span>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                    <span className={item.link ? 'inline-block group-hover-underline-wavy-animated' : 'inline-block'}>
                                        {item.title}
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2 leading-relaxed">
                                    {item.desc}
                                </p>
                                {item.contributors.map((c, i) => (
                                    <p key={i} className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        {c.role}: {c.name}
                                    </p>
                                ))}
                            </div>
                            {item.link && (
                                <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors mt-5 shrink-0" size={16} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Research;
