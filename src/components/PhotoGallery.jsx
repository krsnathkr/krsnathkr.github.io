import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';

import img1 from '../assets/photos/IMG_2495.jpg';
import img2 from '../assets/photos/IMG_2670.jpg';
import img3 from '../assets/photos/IMG_2785.jpg';
import img4 from '../assets/photos/IMG_4250.JPG';
import img5 from '../assets/photos/IMG_7282.jpg';
import img6 from '../assets/photos/IMG_8603.jpg';
import img7 from '../assets/photos/exported_C88BCF84-7DEC-4741-B875-E438F1F47C5F.JPG';
import img8 from '../assets/photos/exported_E1076F47-A519-42D6-A7FD-5417535F5856.jpg';

const row1 = [img1, img2, img3, img4];
const row2 = [img5, img6, img7, img8];

const PhotoGallery = () => {
    const containerRef = useRef(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Subtle horizontal drift: row 1 shifts right, row 2 shifts left
    const x1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
    const x2 = useTransform(scrollYProgress, [0, 1], [20, -20]);

    const closeLightbox = useCallback(() => setSelectedPhoto(null), []);

    return (
        <>
            <section className="mb-20">
                <SectionTitle
                    title="Moments & Milestones"
                    subtitle="A glimpse into my world. (Psst... click on a photo!)"
                    className="mb-8"
                />

                <div ref={containerRef} className="-mx-6 md:-mx-28 lg:-mx-40 relative overflow-hidden">
                    {/* Left blur fade */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: '80px',
                            background: 'linear-gradient(to right, var(--bg-color) 0%, transparent 100%)',
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Right blur fade */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '80px',
                            background: 'linear-gradient(to left, var(--bg-color) 0%, transparent 100%)',
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Row 1 */}
                    <motion.div
                        style={{ x: x1 }}
                        className="flex gap-2 mb-2"
                    >
                        {row1.map((src, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 h-40 md:h-52 cursor-pointer"
                                onClick={() => setSelectedPhoto(src)}
                            >
                                <img
                                    src={src}
                                    alt=""
                                    className="h-full w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    style={{ borderRadius: '4px' }}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Row 2 */}
                    <motion.div
                        style={{ x: x2 }}
                        className="flex gap-2"
                    >
                        {row2.map((src, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 h-40 md:h-52 cursor-pointer"
                                onClick={() => setSelectedPhoto(src)}
                            >
                                <img
                                    src={src}
                                    alt=""
                                    className="h-full w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    style={{ borderRadius: '4px' }}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeLightbox}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            cursor: 'zoom-out',
                            padding: '2rem',
                        }}
                    >
                        <motion.img
                            src={selectedPhoto}
                            alt=""
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Close hint */}
                        <span
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '1.5rem',
                                fontWeight: 300,
                                cursor: 'pointer',
                                lineHeight: 1,
                            }}
                            onClick={closeLightbox}
                        >
                            ✕
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PhotoGallery;
