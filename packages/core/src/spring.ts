
export interface SpringOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    restSpeed?: number;
    restDelta?: number;
}

export const springPresets = {
    stiff: { stiffness: 200, damping: 20 },
    gentle: { stiffness: 100, damping: 15 },
    bouncy: { stiffness: 200, damping: 10 },
    snappy: { stiffness: 300, damping: 25 },
};

export type SpringPreset = keyof typeof springPresets;

export function spring({
    stiffness = 100,
    damping = 10,
    mass = 1,
    velocity = 0,
    restSpeed = 0.001,
    restDelta = 0.001,
}: SpringOptions = {}) {
    return (from: number, to: number, onUpdate: (v: number, vel: number) => void) => {
        return new Promise<void>((resolve) => {
            let currentVelocity = velocity;
            let currentValue = from;
            let lastTime = performance.now();
            const timeStep = 1 / 60; // Fixed 60fps step
            let accumulator = 0;

            const update = (time: number) => {
                const delta = (time - lastTime) / 1000;
                lastTime = time;
                accumulator += Math.min(delta, 0.1); // Cap delta to avoid spiral of death

                while (accumulator >= timeStep) {
                    const springForce = -stiffness * (currentValue - to);
                    const dampingForce = -damping * currentVelocity;
                    const acceleration = (springForce + dampingForce) / mass;

                    currentVelocity += acceleration * timeStep;
                    currentValue += currentVelocity * timeStep;
                    accumulator -= timeStep;
                }

                onUpdate(currentValue, currentVelocity);

                const isResting =
                    Math.abs(currentVelocity) < restSpeed &&
                    Math.abs(currentValue - to) < restDelta;

                if (!isResting) {
                    requestAnimationFrame(update);
                } else {
                    onUpdate(to, currentVelocity);
                    resolve();
                }
            };

            requestAnimationFrame(update);
        });
    };
}
