
export type Easing = (t: number) => number;

export const linear: Easing = (t) => t;
export const easeIn: Easing = (t) => t * t;
export const easeOut: Easing = (t) => t * (2 - t);
export const easeInOut: Easing = (t) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const cubicBezier = (x1: number, y1: number, x2: number, y2: number): Easing => {
    // Simple approximation for a cubic bezier
    return (t: number) => {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;

        // Binary search for t given x
        let low = 0, high = 1, mid = 0;
        for (let i = 0; i < 8; i++) {
            mid = (low + high) / 2;
            if (sampleCurveX(mid) < t) low = mid;
            else high = mid;
        }

        return ((ay * mid + by) * mid + cy) * mid;
    };
};

export const eases = {
    linear,
    easeIn,
    easeOut,
    easeInOut,
};
