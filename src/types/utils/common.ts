// This is kosher because this is the one use case in which the {} type actually means something.
// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyIntersection = {};

type EnumObject<K = string | number> =  Record<string, K>;
type Enum<K, E extends EnumObject<K>> = E extends Record<string, infer T | string> ? T : never;

export function getStringEnumValues<E extends EnumObject<string>>(enumObject: E): Enum<string, E>[] {
    return Object.keys(enumObject).map(key => enumObject[key] as Enum<string, E>);
}

export type PlainType<T> = {
    [P in keyof T]: T[P];
};

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Distributive omit - if T = A | B | C, then DOmit<T, K> = DOmit<A, K> | DOmit<B, K> | DOmit<C, K>
 */
export type DOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/**
 * Distributive keyof
 */
export type DKeyof<T> = T extends unknown ? keyof T : never;

export type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & DOmit<T, K>;

export type RequiredBy<T, K extends keyof T> = Pick<Required<T>, K> & DOmit<T, K>;
