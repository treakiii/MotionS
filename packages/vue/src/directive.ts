
import { Directive, DirectiveBinding } from "vue";
import { animate, AnimationOptions, setupDrag, setupGestures } from "@motions/dom";

export const vMotion: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { initial, whileHover, whileTap, drag, transition } = binding.value || {};

        if (initial) {
            el.dataset.initial = JSON.stringify(initial);
            Object.entries(initial).forEach(([key, value]) => {
                const isTransform = ["x", "y", "rotate", "scale"].includes(key);
                if (!isTransform) {
                    const unit = typeof value === "number" && (key === "width" || key === "height" || key === "top" || key === "left") ? "px" : "";
                    el.style.setProperty(key, (value as string) + unit);
                }
            });
        }

        if (whileHover || whileTap) {
            setupGestures(el, { hover: whileHover, tap: whileTap, transition });
        }

        if (drag) {
            setupDrag(el);
        }
    },
    updated(el: HTMLElement, binding: any) {
        const value = binding.value;
        const oldValue = binding.oldValue;

        if (JSON.stringify(value.animate) !== JSON.stringify(oldValue.animate)) {
            animate(el, value.animate, value.transition || {});
        }
    },
};
