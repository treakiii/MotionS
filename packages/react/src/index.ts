
export * from "./motion";
export * from "./AnimatePresence";
export * from "./useScroll";
export * from "./useAnimation";
export * from "./useMotionValue";
export * from "./useCycle";
export * from "./useFollowPointer";
export * from "./useTransform";

// Re-export everything from dom EXCEPT motion to avoid naming conflicts
export {
    animate,
    setupGestures as domGestures,
    scroll,
    layout,
    timeline,
    inView,
    setupDrag as domDrag,
    stagger,
    easeInOut,
    spring,
    springPresets
} from "@motions/dom";
