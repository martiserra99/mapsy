import { Values, Reduce } from "./utility-types";

export type Params = {
  object: unknown;
  nested: string[];
  subset: string[];
  params: unknown[];
  return: unknown;
};

export type Narrow<
  T extends {
    object: unknown;
    nested: string[];
    subset: string[];
    reduce: unknown;
  }
> = Reduce<T["object"], T["nested"], T["subset"], T["reduce"]>;

type Caller<
  T,
  U extends string[],
  V extends string[],
  W extends unknown[],
  X
> = Values<T, [...U, ...V]> extends string
  ? { [K in Values<T, [...U, ...V]>]: Callback<Reduce<T, U, V, K>, W, X> }
  : never;

type Callback<T, U extends unknown[], V> = (value: T, ...args: U) => V;

/**
 * This utility function is used to map a value to a corresponding function based on the type of the value.
 *
 * @template T The type we are dealing with.
 * @template U The path to the key that we want to narrow down.
 * @template V The path to the discriminator key used to extract the subset.
 * @template W The extra parameters of the returned function.
 * @template X The return type of the returned function.
 *
 * @param nested The path to the key that we want to narrow down.
 * @param subset The path to the discriminator key used to extract the subset.
 * @param caller The mapper object with the keys and the corresponding functions.
 *
 * @returns A function that maps a value to a corresponding function based on the type of the value.
 */
export function mapsy<T extends Params>(
  nested: T["nested"],
  subset: T["subset"],
  caller: Caller<
    T["object"],
    T["nested"],
    T["subset"],
    T["params"],
    T["return"]
  >
): (value: T["object"], ...args: T["params"]) => T["return"] {
  return (value: T["object"], ...args: T["params"]): T["return"] => {
    const path: string[] = [...nested, ...subset];
    const key = path.reduce((acc, key) => {
      const object = acc as object;
      const property = key as keyof typeof object;
      return object[property];
    }, value) as keyof typeof caller;
    const callback = caller[key] as Callback<
      Reduce<T["object"], T["nested"], T["subset"], typeof key>,
      T["params"],
      T["return"]
    >;
    return callback(
      value as Reduce<T["object"], T["nested"], T["subset"], typeof key>,
      ...args
    );
  };
}
