import { useEffect, useState } from "react";
import { MotionValue, useMotionValue } from "./useMotionValue";

export function useTransform<T, R>(
    value: MotionValue<T>,
    input: T[],
    output: R[]
): MotionValue<R> {
    const transformedValue = useMotionValue(output[0]);

    useEffect(() => {
        return value.onChange((v: any) => {
            // Find the index of the segment
            let i = 0;
            while (i < input.length - 2 && v > input[i + 1]) {
                i++;
            }

            const from = input[i] as any;
            const to = input[i + 1] as any;
            const outputFrom = output[i] as any;
            const outputTo = output[i + 1] as any;

            const progress = (v - from) / (to - from);
            const clampedProgress = Math.max(0, Math.min(1, progress));

            if (typeof outputFrom === "number" && typeof outputTo === "number") {
                const result = outputFrom + (outputTo - outputFrom) * clampedProgress;
                transformedValue.set(result as any);
            }
        });
    }, [value, input, output, transformedValue]);

    return transformedValue;
}
