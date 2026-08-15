type HookedFunctionCallback<T extends (...args: any[]) => any> = (original: T, ...args: Parameters<T>) => ReturnType<T>;

/**
 * Hook a function not belonging to a class instance, be it static or independent
 */
export function hookFunction<T extends (...args: any[]) => any>(method: T, callback: HookedFunctionCallback<T>): T {
  return function (...args: Parameters<T>) {
    return callback(method, ...args);
  } as T;
}

/*
type HookedMethodCallback<T extends (...args: any[]) => any> = (original: T, ...args: Parameters<T>) => ReturnType<T>;
*/

/**
 * Hook a method of a class, exposing the instance to the callback
 */
/*
export function hookMethod<T, M extends keyof T>(
  klass: T,
  method: M,
  callback: HookedMethodCallback<T>,
) {
  return function (...args: Parameters<T>) {
    return callback(method, ...args);
  } as T;
} */

type FunctionAsCtor<T extends (...args: any[]) => any> = new (...args: Parameters<T>) => ReturnType<T>;
type HookedFunctionCtorCallback<T extends (...args: any[]) => any>
  = (Original: FunctionAsCtor<T>, ...args: Parameters<T>) => ReturnType<T>;

/**
 * Hook a function constructor (es5 pseudo class pattern)
 */
export function hookFunctionCtor<T extends (...args: any[]) => any>(
  functionCtor: T,
  callback: HookedFunctionCtorCallback<T>,
): T {
  return function (...args: Parameters<T>) {
    return callback(functionCtor as unknown as FunctionAsCtor<T>, ...args);
  } as T;
}
