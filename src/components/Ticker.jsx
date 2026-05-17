import React, { useRef, useEffect, useCallback, useState } from 'react';
import highlights from '../data/highlights.json';

const BASE_SPEED = -1.2;      // px/frame auto-scroll leftward
const FRICTION = 0.96;        // velocity decay per frame (coasting)
const HOVER_FRICTION = 0.88;  // stronger decay when hovering to stop

const TickerItem = ({ item, 'aria-hidden': ariaHidden }) => (
    <span className="flex items-center" aria-hidden={ariaHidden}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-4 flex-shrink-0" />
        {item.url ? (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={ariaHidden ? -1 : 0}
                className="text-sm font-light text-gray-600 dark:text-gray-400 hover:underline"
            >
                {item.text}
            </a>
        ) : (
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">{item.text}</span>
        )}
        <span className="mx-4 text-gray-400 dark:text-gray-600">·</span>
    </span>
);

const Ticker = () => {
    const trackRef = useRef(null);
    const contentRef = useRef(null);
    const contentWidth = useRef(0);
    const [copies, setCopies] = useState(6); // enough to cover viewport; updated after measure

    // Physics state — all refs to avoid re-renders
    const offset = useRef(0);
    const velocity = useRef(BASE_SPEED);
    const isHovering = useRef(false);
    const isDragging = useRef(false);
    const didDrag = useRef(false);
    const lastX = useRef(0);
    const recentDeltas = useRef([]); // [{dx, t}] window for throw velocity
    const rafId = useRef(null);

    const loop = useCallback(() => {
        if (!isDragging.current) {
            if (isHovering.current) {
                velocity.current *= HOVER_FRICTION;
                if (Math.abs(velocity.current) < 0.05) velocity.current = 0;
            } else {
                // Gradually return to auto-scroll speed
                velocity.current = velocity.current * FRICTION + BASE_SPEED * (1 - FRICTION);
            }
            offset.current += velocity.current;
        }

        // Seamless loop: stay in [−contentWidth, 0)
        const w = contentWidth.current;
        if (w > 0) {
            if (offset.current <= -w) offset.current += w;
            if (offset.current > 0) offset.current -= w;
        }

        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${offset.current}px)`;
        }

        rafId.current = requestAnimationFrame(loop);
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            const w = contentRef.current.offsetWidth;
            contentWidth.current = w;
            if (w > 0) {
                // Need enough copies so total width > 2× viewport, preventing gaps at any offset
                const needed = Math.ceil((window.innerWidth * 2) / w) + 2;
                setCopies(Math.max(4, needed));
            }
        }
        rafId.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId.current);
    }, [loop]);

    const onPointerDown = (e) => {
        if (e.button !== 0) return;
        // Don't start drag when clicking on a link — let the browser handle navigation
        if (e.target.closest('a')) return;
        isDragging.current = true;
        didDrag.current = false;
        velocity.current = 0;
        lastX.current = e.clientX;
        recentDeltas.current = [];
        trackRef.current?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!isDragging.current) return;
        const now = performance.now();
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        if (Math.abs(dx) > 2) didDrag.current = true;

        recentDeltas.current.push({ dx, t: now });
        // Keep only the last 100 ms for throw velocity sampling
        recentDeltas.current = recentDeltas.current.filter(d => now - d.t < 100);

        offset.current += dx;
    };

    const onPointerUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const deltas = recentDeltas.current;
        if (deltas.length >= 2) {
            const totalDx = deltas.reduce((s, d) => s + d.dx, 0);
            const span = deltas[deltas.length - 1].t - deltas[0].t;
            // Convert px/ms → px/frame (~16.67 ms at 60 fps)
            velocity.current = span > 0 ? (totalDx / span) * 16.67 : 0;
        } else {
            velocity.current = 0;
        }
    };

    if (highlights.length === 0) return null;

    return (
        <div
            role="region"
            aria-label="Recent highlights"
            className="sticky top-0 w-full z-[60] h-9 flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800"
            onMouseEnter={() => { isHovering.current = true; }}
            onMouseLeave={() => { isHovering.current = false; isDragging.current = false; }}
        >
            <span className="flex-shrink-0 px-3 text-xs font-semibold tracking-widest uppercase text-green-600 dark:text-green-400 border-r border-gray-100 dark:border-gray-800 self-stretch flex items-center bg-white dark:bg-[#0a0a0a] z-10 select-none">
                Recent Wins
            </span>
            <div
                ref={trackRef}
                className="flex whitespace-nowrap will-change-transform cursor-grab active:cursor-grabbing select-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={(e) => { if (didDrag.current) e.preventDefault(); }}
            >
                {Array.from({ length: copies }, (_, copy) => (
                    <span
                        key={copy}
                        ref={copy === 0 ? contentRef : undefined}
                        className="flex"
                        aria-hidden={copy > 0 ? 'true' : undefined}
                    >
                        {highlights.map((item, i) => (
                            <TickerItem key={i} item={item} aria-hidden={copy > 0 ? 'true' : undefined} />
                        ))}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Ticker;
