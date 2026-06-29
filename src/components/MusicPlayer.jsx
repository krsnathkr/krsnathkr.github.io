import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicNote, MusicNotes } from '@phosphor-icons/react';

const MotionSpan = motion.span;

// ponytail: disc IS the play/pause button. No transport bar, no volume slider —
// add when someone actually asks. Track is CC0 (HoliznaCC0), no attribution needed.
const TRACK = '/lofi.mp3';

const MusicPlayer = () => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [notes, setNotes] = useState([]);

    // Spawn a music note every ~900ms while playing; each removes itself on exit.
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            setNotes((n) => [
                ...n,
                {
                    id: crypto.randomUUID(),
                    x: (Math.random() - 0.5) * 36,      // horizontal drift
                    rot: (Math.random() - 0.5) * 40,    // tumble
                    Icon: Math.random() > 0.5 ? MusicNote : MusicNotes,
                },
            ]);
        }, 900);
        return () => clearInterval(id);
    }, [playing]);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            audio.play().catch(() => {}); // ignore autoplay-policy rejections
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <audio
                ref={audioRef}
                src={TRACK}
                loop
                preload="none"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

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

            {/* The vinyl record — black in both themes; marker dot + sheen make the spin obvious */}
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
                        // soft rotating sheen (seamless wrap) + subtle record grooves
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
