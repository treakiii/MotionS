
import { setupGestures } from "./gestures";
import { animate } from "./animate";

export function setupDrag(element: HTMLElement) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        element.setPointerCapture(e.pointerId);
        element.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;

        animate(element, { x: offsetX, y: offsetY }, { duration: 0 });
    };

    const onPointerUp = (e: PointerEvent) => {
        isDragging = false;
        element.releasePointerCapture(e.pointerId);
        element.style.cursor = "grab";
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.style.cursor = "grab";
    element.style.touchAction = "none";

    return () => {
        element.removeEventListener("pointerdown", onPointerDown);
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerup", onPointerUp);
    };
}
