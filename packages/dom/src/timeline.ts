
import { animate, AnimationOptions } from "@motions/dom";

export type TimelineSegment = [HTMLElement, Record<string, any>, AnimationOptions?];

export async function timeline(segments: TimelineSegment[]) {
    for (const [element, keyframes, options] of segments) {
        await animate(element, keyframes, options);
    }
}
