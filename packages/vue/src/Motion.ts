
import { defineComponent, h, ref, onMounted, watch } from "vue";
import { animate, AnimationOptions } from "@motions/dom";

export const Motion = defineComponent({
    name: "Motion",
    props: {
        as: { type: String, default: "div" },
        animate: { type: Object, default: () => ({}) },
        initial: { type: Object, default: () => ({}) },
        transition: { type: Object, default: () => ({}) },
    },
    setup(props: any, { slots, attrs }: any) {
        const root = ref<HTMLElement | null>(null);

        onMounted(() => {
            if (root.value && props.initial) {
                Object.entries(props.initial).forEach(([key, value]) => {
                    const unit = typeof value === "number" && (key === "width" || key === "height" || key === "top" || key === "left") ? "px" : "";
                    root.value!.style.setProperty(key, value + unit);
                });
            }
        });

        watch(
            () => props.animate,
            (newAnimate: any) => {
                if (root.value && newAnimate) {
                    animate(root.value, newAnimate, props.transition as AnimationOptions);
                }
            },
            { deep: true, immediate: true }
        );

        return () => h(props.as, { ...attrs, ref: root }, slots.default?.());
    },
});
