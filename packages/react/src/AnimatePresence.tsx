
import React, { createContext, useContext, useMemo, useState, useEffect, useRef, useId } from "react";

export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    onExitComplete?: () => void;
}

export const PresenceContext = createContext<{
    register: (id: string, onExit: () => Promise<void>) => void;
    unregister: (id: string, isExiting: boolean) => void;
} | null>(null);

export const AnimatePresence = ({ children, initial = true, onExitComplete }: AnimatePresenceProps) => {
    const [childrenToRender, setChildrenToRender] = useState(React.Children.toArray(children));
    const prevChildren = useRef(childrenToRender);
    const exitCallbacks = useRef(new Map<string, () => Promise<void>>());
    const exitingChildren = useRef(new Set<string>());

    useEffect(() => {
        const nextChildren = React.Children.toArray(children);
        const prevKeys = prevChildren.current.map((c: any) => c.key);
        const nextKeys = nextChildren.map((c: any) => c.key);

        const removedChildren = prevChildren.current.filter((c: any) => !nextKeys.includes(c.key));

        if (removedChildren.length > 0) {
            removedChildren.forEach((child: any) => {
                const key = child.key;
                if (key && !exitingChildren.current.has(key)) {
                    exitingChildren.current.add(key);
                    const onExit = exitCallbacks.current.get(key);
                    if (onExit) {
                        onExit().then(() => {
                            exitingChildren.current.delete(key);
                            setChildrenToRender((current: any[]) => current.filter((c: any) => c.key !== key));
                        });
                    } else {
                        exitingChildren.current.delete(key);
                        setChildrenToRender((current: any[]) => current.filter((c: any) => c.key !== key));
                    }
                }
            });
            // Keep removed children in the list for now
            setChildrenToRender((current: any[]) => {
                const filteredNext = nextChildren.filter((c: any) => !prevKeys.includes(c.key));
                // This is a naive merge, but should work for simple cases
                return [...nextChildren, ...removedChildren].sort((a: any, b: any) => {
                    // Try to preserve order if possible, otherwise just append removed at the end
                    return 0;
                });
            });
        } else {
            setChildrenToRender(nextChildren);
        }

        prevChildren.current = nextChildren;
    }, [children]);

    const contextValue = useMemo(() => ({
        register: (id: string, onExit: () => Promise<void>) => {
            exitCallbacks.current.set(id, onExit);
        },
        unregister: (id: string, isExiting: boolean) => {
            if (!isExiting) {
                exitCallbacks.current.delete(id);
            }
        }
    }), []);

    return (
        <PresenceContext.Provider value={contextValue}>
            {childrenToRender}
        </PresenceContext.Provider>
    );
};
