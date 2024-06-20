import { useEffect, useRef } from 'react';

export function useCached<T>(value: T): T

/**
 * This mode is needed for the cases when the initial value can be undefined but we still want to have always a defined value.
 */
export function useCached<T>(value: T | undefined, defaultValue: T): T;

/**
 * Caches last non-undefined value for modals and other components with transition that rely on it.
 */
export function useCached<T>(value?: T, defaultValue?: T) {
    // The useState hook is not applicable here because it would force re-render event if the new value didn't change.
    const lastRef = useRef(value);

    useEffect(() => {
        if (value)
            lastRef.current = value;

    }, [ value ]);

    // We do want to provide the current value first and only fallback to the cached one if the current is not defined.
    return value ?? lastRef.current ?? defaultValue;
}
