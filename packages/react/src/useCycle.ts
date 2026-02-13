
import { useState } from "react";

export function useCycle<T>(...items: T[]): [T, () => void] {
    const [index, setIndex] = useState(0);

    const cycle = () => {
        setIndex((prev) => (prev + 1) % items.length);
    };

    return [items[index], cycle];
}
