
import { animate, AnimationOptions } from "./animate";

export function layout(element: HTMLElement, options: AnimationOptions = {}) {
    const first = element.getBoundingClientRect();

    return (onEnd?: () => void) => {
        const last = element.getBoundingClientRect();

        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const dw = first.width / last.width;
        const dh = first.height / last.height;

        if (dx === 0 && dy === 0 && dw === 1 && dh === 1) return;

        element.style.transformOrigin = "top left";
        element.style.transform = `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;

        // Reset after a frame to start animation
        requestAnimationFrame(() => {
            animate(element, {
                x: 0,
                y: 0,
                scaleX: 1, // We need to update animate to support scaleX/Y
                scaleY: 1
            }, options).then(onEnd);
        });
    };
}
