
export interface ScrollOptions {
    container?: HTMLElement;
    target?: HTMLElement;
    offset?: any; // To be implemented
}

export interface ScrollInfo {
    x: {
        current: number;
        progress: number;
        scrollLength: number;
        velocity: number;
    };
    y: {
        current: number;
        progress: number;
        scrollLength: number;
        velocity: number;
    };
}

export function scroll(onUpdate: (info: ScrollInfo) => void, options: ScrollOptions = {}) {
    const container = options.container || document.documentElement;

    const updateInfo = () => {
        const isRoot = container === document.documentElement;
        const x = isRoot ? window.scrollX : container.scrollLeft;
        const y = isRoot ? window.scrollY : container.scrollTop;

        const maxScrollX = isRoot
            ? document.documentElement.scrollWidth - window.innerWidth
            : container.scrollWidth - container.clientWidth;

        const maxScrollY = isRoot
            ? document.documentElement.scrollHeight - window.innerHeight
            : container.scrollHeight - container.clientHeight;

        const info: ScrollInfo = {
            x: {
                current: x,
                progress: maxScrollX === 0 ? 0 : x / maxScrollX,
                scrollLength: maxScrollX,
                velocity: 0 // Velocity tracking would need time delta
            },
            y: {
                current: y,
                progress: maxScrollY === 0 ? 0 : y / maxScrollY,
                scrollLength: maxScrollY,
                velocity: 0
            }
        };

        onUpdate(info);
    };

    const target = container === document.documentElement ? window : container;
    target.addEventListener("scroll", updateInfo, { passive: true });

    // Initial call
    updateInfo();

    return () => target.removeEventListener("scroll", updateInfo);
}
