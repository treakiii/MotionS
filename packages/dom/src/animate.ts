
import { spring, SpringOptions, Easing, linear, springPresets, SpringPreset } from "@motions/core";

export interface AnimationOptions extends SpringOptions {
    type?: "spring" | "tween";
    spring?: SpringPreset;
    duration?: number;
    easing?: Easing;
    delay?: number;
    repeat?: number;
    perspective?: number;
}

export function animate(
    element: HTMLElement,
    keyframes: Record<string, any>,
    options: AnimationOptions = {}
) {
    let {
        type = options.stiffness || options.damping || options.spring ? "spring" : "tween",
        duration = 0.3,
        easing = linear,
        delay = 0,
        repeat = 0,
        perspective = 1000,
        spring: springPreset,
        ...springOptions
    } = options;

    if (springPreset && springPresets[springPreset]) {
        springOptions = { ...springOptions, ...springPresets[springPreset] };
    }

    const animationPromises = Object.entries(keyframes).map(([key, value]) => {
        return new Promise<void>((resolve) => {
            const computed = getComputedStyle(element);
            const isTransform = ["x", "y", "z", "rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY"].includes(key);
            const isFilter = ["blur", "brightness", "contrast", "grayscale", "hueRotate", "invert", "saturate", "sepia"].includes(key);
            const isColor = ["backgroundColor", "color", "borderColor", "stopColor", "fill", "stroke"].includes(key);

            let startValue: any;
            let startVelocity = 0;
            const velocities = (element.dataset.velocities ? JSON.parse(element.dataset.velocities) : {}) as Record<string, number>;

            if (isTransform) {
                const transforms = (element.dataset.transforms ? JSON.parse(element.dataset.transforms) : {}) as Record<string, number>;
                startValue = transforms[key] ?? (key.startsWith("scale") ? 1 : 0);
                startVelocity = velocities[key] || 0;
            } else if (isFilter) {
                const filters = (element.dataset.filters ? JSON.parse(element.dataset.filters) : {}) as Record<string, number>;
                startValue = filters[key] ?? 0;
                startVelocity = velocities[key] || 0;
            } else if (key === "opacity") {
                startValue = parseFloat(computed.opacity) || 1;
                startVelocity = velocities[key] || 0;
            } else if (key === "pathLength" || key === "pathOffset") {
                startValue = 0;
                startVelocity = velocities[key] || 0;
            } else if (isColor) {
                startValue = computed.getPropertyValue(key === "backgroundColor" ? "background-color" : key);
            } else {
                startValue = parseFloat(computed.getPropertyValue(key)) || 0;
                startVelocity = velocities[key] || 0;
            }

            const targetValue = Array.isArray(value) ? value[value.length - 1] : value;
            const values = Array.isArray(value) ? value : [startValue, value];

            // Color helper
            const lerpColor = (a: string, b: string, t: number) => {
                const parse = (c: string) => {
                    if (c.startsWith("rgb")) {
                        const m = c.match(/\d+/g);
                        return m ? m.map(Number) : [0, 0, 0];
                    }
                    if (c.startsWith("#")) {
                        const hex = c.slice(1);
                        if (hex.length === 3) {
                            return hex.split("").map(x => parseInt(x + x, 16));
                        }
                        const r = parseInt(hex.slice(0, 2), 16);
                        const g = parseInt(hex.slice(2, 4), 16);
                        const b = parseInt(hex.slice(4, 6), 16);
                        return [r, g, b];
                    }
                    return [0, 0, 0];
                };
                const c1 = parse(a);
                const c2 = parse(b);
                const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
                const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
                const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
                return `rgb(${r}, ${g}, ${b})`;
            };

            const onUpdate = (v: any, vel?: number) => {
                if (typeof v === "number" && vel !== undefined) {
                    const currentVelocities = (element.dataset.velocities ? JSON.parse(element.dataset.velocities) : {}) as Record<string, number>;
                    currentVelocities[key] = vel;
                    element.dataset.velocities = JSON.stringify(currentVelocities);
                }

                if (isTransform) {
                    const transforms = (element.dataset.transforms ? JSON.parse(element.dataset.transforms) : {}) as Record<string, number>;
                    transforms[key] = v;
                    element.dataset.transforms = JSON.stringify(transforms);

                    let transformStr = `perspective(${perspective}px) `;
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
                    element.style.transform = transformStr;
                } else if (isFilter) {
                    const filters = (element.dataset.filters ? JSON.parse(element.dataset.filters) : {}) as Record<string, number>;
                    filters[key] = v;
                    element.dataset.filters = JSON.stringify(filters);

                    let filterStr = "";
                    Object.entries(filters).forEach(([f, val]) => {
                        const unit = f === "blur" ? "px" : f === "hueRotate" ? "deg" : "";
                        filterStr += `${f.replace(/([A-Z])/g, "-$1").toLowerCase()}(${val}${unit}) `;
                    });
                    element.style.filter = filterStr;
                } else if (key === "pathLength" || key === "pathOffset") {
                    const path = element as unknown as SVGPathElement;
                    const length = path.getTotalLength();
                    if (key === "pathLength") {
                        path.style.strokeDasharray = `${v * length} ${length}`;
                    } else if (key === "pathOffset") {
                        path.style.strokeDashoffset = `${-v * length}`;
                    }
                } else if (isColor) {
                    element.style.setProperty(key === "backgroundColor" ? "background-color" : key, v);
                } else {
                    const units = ["width", "height", "top", "left", "right", "bottom", "fontSize", "borderRadius", "padding", "margin"];
                    const unit = typeof v === "number" && units.includes(key) ? "px" : "";
                    element.style.setProperty(key.replace(/([A-Z])/g, "-$1").toLowerCase(), v + unit);
                    if (key === "opacity") element.style.opacity = v.toString();
                }
            };

            const runAnimation = () => {
                if (type === "spring" && !isColor) {
                    spring({ ...springOptions, velocity: startVelocity })(values[0], targetValue, onUpdate).then(() => {
                        if (repeat === Infinity || (typeof repeat === "number" && repeat > 0)) {
                            setTimeout(runAnimation, 0);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    let startTime: number;
                    const tick = (now: number) => {
                        if (!startTime) startTime = now;
                        const elapsed = (now - startTime) / 1000;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easing(progress);

                        let currentValue;
                        if (isColor) {
                            currentValue = lerpColor(values[0], targetValue, easedProgress);
                        } else if (values.length > 2) {
                            const segmentProgress = progress * (values.length - 1);
                            const segmentIndex = Math.min(Math.floor(segmentProgress), values.length - 2);
                            const localProgress = segmentProgress - segmentIndex;
                            currentValue = values[segmentIndex] + (values[segmentIndex + 1] - values[segmentIndex]) * easing(localProgress);
                        } else {
                            currentValue = values[0] + (values[1] - values[0]) * easedProgress;
                        }

                        onUpdate(currentValue, 0);

                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            if (repeat === Infinity || (typeof repeat === "number" && repeat > 0)) {
                                setTimeout(runAnimation, 0);
                            } else {
                                resolve();
                            }
                        }
                    };
                    requestAnimationFrame(tick);
                }
            };

            setTimeout(runAnimation, delay * 1000);
        });
    });

    return Promise.all(animationPromises);
}
