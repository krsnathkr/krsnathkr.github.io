export const shouldDebugHaptics = () => {
    if (import.meta.env.DEV) return true;
    if (typeof window === 'undefined') return false;

    return new URLSearchParams(window.location.search).has('haptics-debug');
};
