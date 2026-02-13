
import { useState, useEffect, useMemo } from "react";
import { scroll, ScrollInfo, ScrollOptions } from "@motions/dom";
import { useMotionValue } from "./useMotionValue";

export function useScroll(options: ScrollOptions = {}) {
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo | null>(null);
    const scrollX = useMotionValue(0);
    const scrollY = useMotionValue(0);
    const scrollXProgress = useMotionValue(0);
    const scrollYProgress = useMotionValue(0);

    useEffect(() => {
        return scroll((info) => {
            setScrollInfo(info);
            scrollX.set(info.x.current);
            scrollY.set(info.y.current);
            scrollXProgress.set(info.x.progress);
            scrollYProgress.set(info.y.progress);
        }, options);
    }, [options.container, options.target]);

    return {
        scrollInfo,
        scrollX,
        scrollY,
        scrollXProgress,
        scrollYProgress
    };
}
