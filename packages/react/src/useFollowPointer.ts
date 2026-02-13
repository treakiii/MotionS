
import { useEffect } from "react";
import { useMotionValue } from "./useMotionValue";

export function useFollowPointer() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, []);

    return { x, y };
}
