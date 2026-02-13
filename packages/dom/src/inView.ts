
export interface InViewOptions {
    root?: Element | Document;
    margin?: string;
    amount?: "any" | "all" | number;
}

export function inView(
    element: Element,
    onEnter: (entry: IntersectionObserverEntry) => void | (() => void),
    options: InViewOptions = {}
) {
    const { root, margin: rootMargin, amount = "any" } = options;

    const threshold = amount === "any" ? 0 : amount === "all" ? 1 : amount;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const onLeave = onEnter(entry);

                    if (onLeave && typeof onLeave === "function") {
                        // To properly handle "onLeave", we'd need more logic to track state
                    }
                }
            });
        },
        { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
}
