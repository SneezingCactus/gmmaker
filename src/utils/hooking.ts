type HookedFunctionCallback<T extends (...args: any[]) => any> = (original: T, ...args: Parameters<T>) => ReturnType<T>;

/**
 * Hook a function not belonging to a class instance, be it static or independent
 */
export function hookFunction<T extends (...args: any[]) => any>(method: T, callback: HookedFunctionCallback<T>): T {
  return function (this: any, ...args: Parameters<T>) {
    console.log(this);
    return callback.apply(this, [method, ...args]);
  } as T;
}

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
