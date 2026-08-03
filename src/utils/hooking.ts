type HookedMethodCallback<T extends (...args: any[]) => any> = (original: T, ...args: Parameters<T>) => ReturnType<T>;

export function hookMethod<T extends (...args: any[]) => any>(method: T, callback: HookedMethodCallback<T>): T {
  return function (...args: Parameters<T>) {
    return callback(method, ...args);
  } as T;
}

type FactoryAsCtor<T extends (...args: any[]) => any> = new (...args: Parameters<T>) => ReturnType<T>;
type HookedFactoryCallback<T extends (...args: any[]) => any>
  = (Original: FactoryAsCtor<T>, ...args: Parameters<T>) => ReturnType<T>;

export function hookFactory<T extends (...args: any[]) => any>(method: T, callback: HookedFactoryCallback<T>): T {
  return function (...args: Parameters<T>) {
    return callback(method as unknown as FactoryAsCtor<T>, ...args);
  } as T;
}
