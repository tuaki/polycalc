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
