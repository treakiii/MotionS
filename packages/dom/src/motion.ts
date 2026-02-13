
import { animate, AnimationOptions } from "./animate";

export const createDomMotion = (element: HTMLElement) => {
    return {
        animate: (keyframes: Record<string, any>, options?: AnimationOptions) => {
            return animate(element, keyframes, options);
        }
    };
};
