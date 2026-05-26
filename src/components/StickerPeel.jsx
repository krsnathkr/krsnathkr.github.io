import { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useWebHaptics } from 'web-haptics/react';
import { shouldDebugHaptics } from '../utils/haptics';

gsap.registerPlugin(Draggable);

const PEEL_TRANSITION_MS = 450;
const PEEL_FALL_DELAY_MS = 280;
const PEEL_RELEASE_TAP_MS = 28;
const PEEL_BUZZ_DELAY_MS = 34;
const PEEL_BUZZ_MS = PEEL_FALL_DELAY_MS - PEEL_BUZZ_DELAY_MS;
const PEEL_SETTLE_DELAY_MS = PEEL_TRANSITION_MS - PEEL_RELEASE_TAP_MS - PEEL_BUZZ_DELAY_MS - PEEL_BUZZ_MS;
const PEEL_BUZZ_PATTERN = {
    pattern: [
        { duration: PEEL_RELEASE_TAP_MS, intensity: 1 },
        { delay: PEEL_BUZZ_DELAY_MS, duration: PEEL_BUZZ_MS, intensity: 0.82 },
        { delay: PEEL_SETTLE_DELAY_MS, duration: 36, intensity: 0.45 },
    ],
    description: 'sticker peel release',
};

const PEEL_STYLES = `
.sticker-container:hover .sticker-main,
.sticker-container.touch-active .sticker-main {
  clip-path: polygon(var(--sticker-start) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
}
.sticker-container:hover .sticker-flap,
.sticker-container.touch-active .sticker-flap {
  clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-start) var(--sticker-peelback-hover)) !important;
  top: calc(-100% + 2 * var(--sticker-peelback-hover) - 1px) !important;
}
.sticker-container:active .sticker-main {
  clip-path: polygon(var(--sticker-start) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
}
.sticker-container:active .sticker-flap {
  clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-start) var(--sticker-peelback-active)) !important;
  top: calc(-100% + 2 * var(--sticker-peelback-active) - 1px) !important;
}
.sticker-container.peeled-off .sticker-main {
  clip-path: polygon(var(--sticker-start) 92%, var(--sticker-end) 92%, var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
  transition: clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.sticker-container.peeled-off .sticker-flap {
  clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) 92%, var(--sticker-start) 92%) !important;
  top: calc(-100% + 184% - 1px) !important;
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
`;

const StickerPeel = ({
    imageSrc,
    rotate = 30,
    peelBackHoverPct = 30,
    peelBackActivePct = 40,
    peelEasing = 'power3.out',
    peelHoverEasing = 'power2.out',
    width = 200,
    shadowIntensity = 0.6,
    lightingIntensity = 0.1,
    initialPosition = 'center',
    peelDirection = 0,
    draggable = true,
    className = ''
}) => {
    const containerRef = useRef(null);
    const dragTargetRef = useRef(null);
    const pointLightRef = useRef(null);
    const pointLightFlippedRef = useRef(null);
    const draggableInstanceRef = useRef(null);
    const isFallingRef = useRef(false);
    const { trigger } = useWebHaptics({
        debug: shouldDebugHaptics(),
    });

    const defaultPadding = 12;

    useEffect(() => {
        const target = dragTargetRef.current;
        if (!target) return;
        if (initialPosition === 'center') return;
        if (typeof initialPosition === 'object' && initialPosition.x !== undefined && initialPosition.y !== undefined) {
            gsap.set(target, { x: initialPosition.x, y: initialPosition.y });
        }
    }, [initialPosition]);

    useEffect(() => {
        if (!draggable) return;
        const target = dragTargetRef.current;
        if (!target) return;

        const boundsEl = target.parentNode;

        const instance = Draggable.create(target, {
            type: 'x,y',
            bounds: boundsEl,
            inertia: true,
            onDrag() {
                const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
                gsap.to(target, { rotation: rot, duration: 0.15, ease: 'power1.out' });
            },
            onDragEnd() {
                gsap.to(target, { rotation: 0, duration: 0.8, ease: 'power2.out' });
            }
        });

        draggableInstanceRef.current = instance[0];

        const handleResize = () => {
            if (draggableInstanceRef.current) draggableInstanceRef.current.update();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (draggableInstanceRef.current) draggableInstanceRef.current.kill();
        };
    }, [draggable]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateLight = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (pointLightRef.current) {
                gsap.set(pointLightRef.current, { attr: { x, y } });
            }

            const normalizedAngle = Math.abs(peelDirection % 360);
            if (pointLightFlippedRef.current) {
                if (normalizedAngle !== 180) {
                    gsap.set(pointLightFlippedRef.current, { attr: { x, y: rect.height - y } });
                } else {
                    gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
                }
            }
        };

        container.addEventListener('mousemove', updateLight);
        return () => container.removeEventListener('mousemove', updateLight);
    }, [peelDirection]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = () => container.classList.add('touch-active');
        const handleTouchEnd = () => container.classList.remove('touch-active');

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);

    const cssVars = useMemo(() => ({
        '--sticker-rotate': `${rotate}deg`,
        '--sticker-p': `${defaultPadding}px`,
        '--sticker-peelback-hover': `${peelBackHoverPct}%`,
        '--sticker-peelback-active': `${peelBackActivePct}%`,
        '--sticker-peel-easing': peelEasing,
        '--sticker-peel-hover-easing': peelHoverEasing,
        '--sticker-width': `${width}px`,
        '--sticker-shadow-opacity': shadowIntensity,
        '--sticker-lighting-constant': lightingIntensity,
        '--peel-direction': `${peelDirection}deg`,
        '--sticker-start': `calc(-1 * ${defaultPadding}px)`,
        '--sticker-end': `calc(100% + ${defaultPadding}px)`
    }), [rotate, peelBackHoverPct, peelBackActivePct, peelEasing, peelHoverEasing, width, shadowIntensity, lightingIntensity, peelDirection]);

    const stickerMainStyle = {
        clipPath: 'polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end))',
        transition: 'clip-path 0.6s ease-out',
        filter: 'url(#dropShadow)',
        willChange: 'clip-path, transform'
    };

    const flapStyle = {
        clipPath: 'polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-start) var(--sticker-start))',
        top: 'calc(-100% - var(--sticker-p) - var(--sticker-p))',
        transform: 'scaleY(-1)',
        transition: 'all 0.6s ease-out',
        willChange: 'clip-path, transform'
    };

    const imageStyle = {
        transform: `rotate(calc(${rotate}deg - ${peelDirection}deg))`,
        width: `${width}px`
    };

    const shadowImageStyle = { ...imageStyle, filter: 'url(#expandAndFill)' };

    const handlePeelOffAndFall = () => {
        const container = containerRef.current;
        const target = dragTargetRef.current;
        if (!container || !target || isFallingRef.current) return;
        isFallingRef.current = true;

        container.classList.add('peeled-off');
        const haptic = trigger(PEEL_BUZZ_PATTERN);
        if (haptic?.catch) {
            haptic.catch(() => {});
        }

        const rect = target.getBoundingClientRect();
        const fallDistance = window.innerHeight - rect.top + rect.height + 100;
        const spin = (Math.random() < 0.5 ? -1 : 1) * (15 + Math.random() * 25);

        gsap.set(target, { zIndex: 9999 });

        gsap.to(target, {
            y: fallDistance,
            rotation: spin,
            duration: 1.4,
            delay: 0.28,
            ease: 'power1.in',
            onComplete: () => {
                gsap.set(target, { visibility: 'hidden' });
            }
        });
    };

    return (
        <div
            className={`${draggable ? 'absolute cursor-grab active:cursor-grabbing' : ''} transform-gpu ${className}`}
            ref={dragTargetRef}
            style={cssVars}
        >
            <style>{PEEL_STYLES}</style>

            <svg width="0" height="0">
                <defs>
                    <filter id="pointLight">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant={lightingIntensity} lightingColor="white">
                            <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceGraphic" result="lit" />
                        <feComposite in="lit" in2="SourceAlpha" operator="in" />
                    </filter>

                    <filter id="pointLightFlipped">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant={lightingIntensity * 7} lightingColor="white">
                            <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceGraphic" result="lit" />
                        <feComposite in="lit" in2="SourceAlpha" operator="in" />
                    </filter>

                    <filter id="dropShadow">
                        <feDropShadow dx="0.5" dy="1.5" stdDeviation={1.5 * shadowIntensity} floodColor="black" floodOpacity={shadowIntensity * 0.6} />
                    </filter>

                    <filter id="expandAndFill">
                        <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
                        <feFlood floodColor="rgb(179,179,179)" result="flood" />
                        <feComposite operator="in" in="flood" in2="shape" />
                    </filter>
                </defs>
            </svg>

            <div
                className="sticker-container relative select-none touch-none sm:touch-auto cursor-pointer"
                ref={containerRef}
                onClick={handlePeelOffAndFall}
                data-haptic="off"
                style={{
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    transform: `rotate(${peelDirection}deg)`,
                    transformOrigin: 'center'
                }}
            >
                <div className="sticker-main" style={stickerMainStyle}>
                    <div style={{ filter: 'url(#pointLight)' }}>
                        <img src={imageSrc} alt="" className="block" style={imageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                </div>

                <div className="absolute top-4 left-2 w-full h-full opacity-40" style={{ filter: 'brightness(0) blur(8px)' }}>
                    <div className="sticker-flap" style={flapStyle}>
                        <img src={imageSrc} alt="" className="block" style={shadowImageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                </div>

                <div className="sticker-flap absolute w-full h-full left-0" style={flapStyle}>
                    <div style={{ filter: 'url(#pointLightFlipped)' }}>
                        <img src={imageSrc} alt="" className="block" style={shadowImageStyle} draggable="false" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickerPeel;
