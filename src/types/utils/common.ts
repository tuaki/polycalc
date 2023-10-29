type EnumObject<K = string | number> = { [key: string]: K };
type Enum<K, E extends EnumObject<K>> = E extends { [key: string]: infer T | string } ? T : never;

export function getStringEnumValues<E extends EnumObject<string>>(enumObject: E): Enum<string, E>[] {
    return Object.keys(enumObject).map(key => enumObject[key] as Enum<string, E>);
}

export type PlainType<T> = {
    [P in keyof T]: T[P];
};