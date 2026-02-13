import { useRef, useEffect, useState } from "react";

export interface MotionValue<T = number> {
    get: () => T;
    set: (value: T) => void;
    onChange: (callback: (value: T) => void) => () => void;
}

export function useMotionValue<T = number>(initialValue: T): MotionValue<T> {
    const valueRef = useRef(initialValue);
    const subscribers = useRef(new Set<(value: T) => void>());

    return {
        get: () => valueRef.current,
        set: (value: T) => {
            valueRef.current = value;
            subscribers.current.forEach((callback) => callback(value));
        },
        onChange: (callback: (value: T) => void) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }
    };
}
