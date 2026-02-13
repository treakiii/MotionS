
import { animate, AnimationOptions } from "./animate";

export interface GestureOptions {
    hover?: Record<string, any>;
    tap?: Record<string, any>;
    transition?: AnimationOptions;
}

export function setupGestures(element: HTMLElement, options: GestureOptions) {
    const { hover, tap, transition } = options;

    if (hover) {
        const handleMouseEnter = () => {
            animate(element, hover, transition);
        };
        const handleMouseLeave = () => {
            // We need a way to revert to the "original" state or the "animate" state.
            // For now, let's assume we can get it from the dataset or it's provided.
            const initial = JSON.parse(element.dataset.initial || "{}");
            animate(element, initial, transition);
        };

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
    }

    if (tap) {
        const handleMouseDown = () => {
            animate(element, tap, transition);
        };
        const handleMouseUp = () => {
            const hoverState = hover || JSON.parse(element.dataset.animate || "{}");
            animate(element, hoverState, transition);
        };

        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("mouseup", handleMouseUp);
        element.addEventListener("touchstart", handleMouseDown);
        element.addEventListener("touchend", handleMouseUp);
    }
}
