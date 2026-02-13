
import { animate, AnimationOptions } from "./animate";

export function stagger(elements: HTMLElement[], keyframes: Record<string, any>, options: AnimationOptions & { staggerDelay?: number } = {}) {
    const { staggerDelay = 0.1, ...restOptions } = options;

    return Promise.all(
        elements.map((el, i) => {
            const delay = (restOptions.delay || 0) + i * staggerDelay;
            return animate(el, keyframes, { ...restOptions, delay });
        })
    );
}
