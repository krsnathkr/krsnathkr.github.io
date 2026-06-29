import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicNote, MusicNotes } from '@phosphor-icons/react';

const MotionSpan = motion.span;
const MotionDiv = motion.div;

// Track is CC0 (HoliznaCC0), no attribution needed.
const TRACK = '/lofi.mp3';
const DEFAULT_VOLUME = 0.35;

const MusicPlayer = () => {
    const audioRef = useRef(null);
    const autoplayTriggered = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [showVolume, setShowVolume] = useState(false);
    const [notes, setNotes] = useState([]);
    const hideTimeout = useRef(null);

    // Try immediate autoplay; fall back to first-gesture if browser blocks it.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;

        const attemptPlay = () => {
            if (autoplayTriggered.current) return;
            autoplayTriggered.current = true;
            audio.play().catch(() => {
                // Browser blocked silent autoplay — wait for a user gesture instead.
                autoplayTriggered.current = false;
                const events = ['click', 'mousedown', 'pointerdown', 'keydown', 'touchstart'];
                const onGesture = () => {
                    if (autoplayTriggered.current) return;
                    autoplayTriggered.current = true;
                    audio.play().catch(() => {});
                    events.forEach((e) => document.removeEventListener(e, onGesture));
                };
                events.forEach((e) => document.addEventListener(e, onGesture, { passive: true }));
            });
        };

        if (audio.readyState >= 3) {
            attemptPlay();
        } else {
            audio.addEventListener('canplaythrough', attemptPlay, { once: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Keep audio volume in sync with slider
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Spawn a music note every ~900ms while playing; each removes itself on exit.
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            setNotes((n) => [
                ...n,
                {
                    id: crypto.randomUUID(),
                    x: (Math.random() - 0.5) * 36,
                    rot: (Math.random() - 0.5) * 40,
                    Icon: Math.random() > 0.5 ? MusicNote : MusicNotes,
                },
            ]);
        }, 900);
        return () => clearInterval(id);
    }, [playing]);

    const toggle = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            audio.volume = volume;
            audio.play().catch(() => {});
        }
    }, [playing, volume]);

    const handleVolumeChange = useCallback((e) => {
        setVolume(parseFloat(e.target.value));
    }, []);

    const handleMouseEnter = useCallback(() => {
        clearTimeout(hideTimeout.current);
        setShowVolume(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        hideTimeout.current = setTimeout(() => setShowVolume(false), 300);
    }, []);

    // Volume percentage for the fill indicator
    const volumePct = Math.round(volume * 100);

    return (
        <div
            className="fixed bottom-6 left-6 z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <audio
                ref={audioRef}
                src={TRACK}
                loop
                preload="auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

            {/* Volume slider — vertical, rises from the disc */}
            <AnimatePresence>
                {showVolume && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 8, scaleY: 0.8 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 8, scaleY: 0.8 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-[52px] flex flex-col items-center"
                        style={{ originY: 1 }}
                    >
                        <div
                            className="relative flex flex-col items-center gap-2 px-2 py-3
                                        rounded-full
                                        bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md
                                        ring-1 ring-black/8 dark:ring-white/10
                                        shadow-lg dark:shadow-black/30"
                        >
                            {/* Volume percentage label */}
                            <span
                                className="text-[9px] font-medium tracking-wider
                                           text-gray-400 dark:text-gray-500 select-none"
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                                {volumePct}
                            </span>

                            {/* Vertical slider track */}
                            <div className="relative h-20 w-[3px] rounded-full bg-gray-200 dark:bg-white/10">
                                {/* Fill bar from bottom */}
                                <div
                                    className="absolute bottom-0 left-0 w-full rounded-full
                                               bg-gray-900 dark:bg-gray-100
                                               transition-all duration-100 ease-out"
                                    style={{ height: `${volumePct}%` }}
                                />
                                {/* Thumb dot */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-[9px] h-[9px]
                                               rounded-full bg-gray-900 dark:bg-gray-100
                                               ring-2 ring-white dark:ring-neutral-900
                                               shadow-sm transition-all duration-100 ease-out"
                                    style={{ bottom: `calc(${volumePct}% - 4px)` }}
                                />
                            </div>

                            {/* Hidden native range input overlaid for interaction */}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                                className="lofi-volume-vertical"
                            />
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Floating notes — emerge from the disc, drift up, fade out */}
            <div className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2">
                <AnimatePresence>
                    {notes.map((note) => {
                      const { id, x, rot } = note;
                      const NoteIcon = note.Icon;
                      return (
                        <MotionSpan
                            key={id}
                            className="absolute text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
                            animate={{ opacity: [0, 1, 1, 0], y: -46, x, scale: 1, rotate: rot }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.4, ease: 'easeOut' }}
                            onAnimationComplete={() =>
                                setNotes((n) => n.filter((m) => m.id !== id))
                            }
                        >
                            <NoteIcon size={14} weight="fill" />
                        </MotionSpan>
                      );
                    })}
                </AnimatePresence>
            </div>

            {/* The vinyl record — black in both themes */}
            <button
                onClick={toggle}
                data-haptic="nudge"
                aria-label={playing ? 'Pause lo-fi music' : 'Play lo-fi music'}
                title={playing ? 'Pause lo-fi' : 'Play lo-fi'}
                className="relative grid place-items-center h-11 w-11 rounded-full
                           bg-gray-900 ring-1 ring-black/10 dark:ring-white/15
                           shadow-sm hover:shadow-md transition-shadow duration-200
                           cursor-pointer overflow-hidden motion-reduce:!animate-none"
                style={{
                    animation: playing ? 'lofi-spin 3s linear infinite' : 'none',
                    backgroundImage:
                        'conic-gradient(rgba(255,255,255,0.20), rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.20)),' +
                        'repeating-radial-gradient(circle at center, transparent 0 1.5px, rgba(255,255,255,0.05) 1.5px 2.5px)',
                }}
            >
                {/* center label + spindle hole */}
                <span className="relative h-4 w-4 rounded-full bg-gray-100 grid place-items-center">
                    <span className="h-1 w-1 rounded-full bg-gray-900" />
                </span>
            </button>
        </div>
    );
};

export default MusicPlayer;

