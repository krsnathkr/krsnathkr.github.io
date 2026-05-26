export const shouldUseHapticAudioFallback = () => {
    if (import.meta.env.DEV) return true;
    if (typeof window === 'undefined') return false;
    if (typeof navigator === 'undefined') return false;

    return (
        !('vibrate' in navigator) ||
        new URLSearchParams(window.location.search).has('haptics-debug')
    );
};
