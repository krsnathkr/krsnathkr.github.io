import { useEffect, useRef, useState } from 'react';

// Dims to `dimOpacity` while scrolling down, restores to full opacity on scroll-up or once scrolling stops.
export default function useScrollFade(dimOpacity = 0.35, idleDelay = 400) {
    const [opacity, setOpacity] = useState(1);
    const lastY = useRef(0);
    const idleTimer = useRef(null);

    useEffect(() => {
        lastY.current = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            const goingDown = y > lastY.current;
            lastY.current = y;
            setOpacity(goingDown ? dimOpacity : 1);
            clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => setOpacity(1), idleDelay);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(idleTimer.current);
        };
    }, [dimOpacity, idleDelay]);

    return opacity;
}
