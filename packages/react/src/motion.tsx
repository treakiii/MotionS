
import React, { forwardRef, useRef, useImperativeHandle, useEffect, useContext, useId, useLayoutEffect } from "react";
import { animate, AnimationOptions, setupGestures, inView, setupDrag, layout as domLayout } from "@motions/dom";
import { PresenceContext } from "./AnimatePresence";
import { MotionValue } from "./useMotionValue";

export interface MotionProps extends Omit<AnimationOptions, "transition"> {
    variants?: Record<string, Record<string, any>>;
    animate?: string | Record<string, any>;
    initial?: string | Record<string, any>;
    exit?: string | Record<string, any>;
    whileHover?: string | Record<string, any>;
    whileTap?: string | Record<string, any>;
    whileInView?: string | Record<string, any>;
    drag?: boolean;
    viewport?: { once?: boolean; margin?: string; amount?: "any" | "all" | number };
    transition?: AnimationOptions;
    layout?: boolean;
    children?: React.ReactNode;
    style?: { [key: string]: any | MotionValue<any> };
    className?: string;
    [key: string]: any;
}

const createMotionComponent = (TagName: string) => {
    return forwardRef<HTMLElement, MotionProps>(({
        animate: animateTarget, initial, exit, whileHover, whileTap, whileInView,
        variants, drag, viewport, transition, style, layout, ...props
    }, ref) => {
        const elementRef = useRef<HTMLElement>(null);
        useImperativeHandle(ref, () => elementRef.current!);
        const presence = useContext(PresenceContext);
        const id = useId();

        const resolveVariant = (target?: string | Record<string, any>) => {
            if (typeof target === "string" && variants && variants[target]) {
                return variants[target];
            }
            return typeof target === "object" ? target : undefined;
        };

        // Layout Transitions
        useLayoutEffect(() => {
            if (layout && elementRef.current) {
                const finishLayout = domLayout(elementRef.current, transition || props);
                return () => finishLayout();
            }
        });

        useEffect(() => {
            if (presence && exit) {
                const onExit = async () => {
                    if (elementRef.current) {
                        const exitTarget = resolveVariant(exit);
                        if (exitTarget) {
                            await animate(elementRef.current, exitTarget, transition || props);
                        }
                    }
                };
                presence.register(id, onExit);
                return () => presence.unregister(id, false);
            }
        }, [presence, exit, id]);

        useEffect(() => {
            if (elementRef.current) {
                const initialTarget = resolveVariant(initial);
                if (initialTarget) {
                    Object.entries(initialTarget).forEach(([key, value]) => {
                        const isTransform = ["x", "y", "z", "rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY"].includes(key);
                        if (!isTransform && typeof value !== "object") {
                            const units = ["width", "height", "top", "left", "borderRadius"];
                            const unit = typeof value === "number" && units.includes(key) ? "px" : "";
                            elementRef.current!.style.setProperty(key.replace(/([A-Z])/g, "-$1").toLowerCase(), value + unit);
                        }
                    });
                }

                if (whileHover || whileTap) {
                    setupGestures(elementRef.current, {
                        hover: resolveVariant(whileHover),
                        tap: resolveVariant(whileTap),
                        transition: transition || props
                    });
                }

                if (whileInView) {
                    inView(elementRef.current, () => {
                        const inViewTarget = resolveVariant(whileInView);
                        if (inViewTarget) {
                            animate(elementRef.current!, inViewTarget, transition || props);
                        }
                    }, viewport);
                }

                if (drag) {
                    setupDrag(elementRef.current);
                }
            }
        }, [drag]);

        useEffect(() => {
            const target = resolveVariant(animateTarget);
            if (elementRef.current && target) {
                animate(elementRef.current, target, transition || props);
            }
        }, [animateTarget, transition]);

        useEffect(() => {
            if (elementRef.current && style) {
                const unsubs: Array<() => void> = [];
                Object.entries(style).forEach(([key, value]) => {
                    if (value && typeof value === "object" && "onChange" in (value as any)) {
                        const mv = value as any;
                        const update = (v: any) => {
                            if (!elementRef.current) return;
                            const isTransform = ["x", "y", "z", "rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY"].includes(key);
                            if (isTransform) {
                                const transforms = (elementRef.current.dataset.transforms ? JSON.parse(elementRef.current.dataset.transforms) : {}) as Record<string, number>;
                                transforms[key] = v;
                                elementRef.current.dataset.transforms = JSON.stringify(transforms);

                                let transformStr = "perspective(1000px) ";
                                if (transforms.x !== undefined || transforms.y !== undefined || transforms.z !== undefined) {
                                    transformStr += `translate3d(${transforms.x || 0}px, ${transforms.y || 0}px, ${transforms.z || 0}px) `;
                                }
                                if (transforms.rotate !== undefined) transformStr += `rotateZ(${transforms.rotate}deg) `;
                                if (transforms.rotateX !== undefined) transformStr += `rotateX(${transforms.rotateX}deg) `;
                                if (transforms.rotateY !== undefined) transformStr += `rotateY(${transforms.rotateY}deg) `;
                                if (transforms.scale !== undefined) transformStr += `scale(${transforms.scale}) `;
                                else if (transforms.scaleX !== undefined || transforms.scaleY !== undefined) {
                                    transformStr += `scale(${transforms.scaleX ?? 1}, ${transforms.scaleY ?? 1}) `;
                                }
                                elementRef.current.style.transform = transformStr;
                            } else {
                                const unit = typeof v === "number" && ["width", "height", "top", "left"].includes(key) ? "px" : "";
                                elementRef.current.style.setProperty(key.replace(/([A-Z])/g, "-$1").toLowerCase(), v + unit);
                            }
                        };
                        unsubs.push(mv.onChange(update));
                        update(mv.get());
                    }
                });
                return () => unsubs.forEach((unsub) => unsub());
            }
        }, [style]);

        return React.createElement(TagName, { ref: elementRef, ...props });
    });
};

export const motion = new Proxy(
    {},
    {
        get: (_, tagName: string) => {
            return createMotionComponent(tagName);
        },
    }
) as unknown as {
        [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
            MotionProps & Omit<React.ComponentPropsWithRef<K>, "style">
        >;
    };
