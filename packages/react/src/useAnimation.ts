
import { useRef } from "react";
import { animate, AnimationOptions } from "@motions/dom";

export function useAnimation() {
    const animationRef = useRef<Promise<void[]> | null>(null);

    const start = (element: HTMLElement | null, keyframes: Record<string, any>, options?: AnimationOptions): Promise<void[]> | undefined => {
        if (!element) return;
        const promise = animate(element, keyframes, options);
        animationRef.current = promise;
        return promise;
    };

    return {
        start,
        // We could add stop, pause, etc here if we update the core animate function to return an animation object
    };
}
