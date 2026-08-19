type HookedFunctionCallback<T extends (...args: any[]) => any> = (original: T, ...args: Parameters<T>) => ReturnType<T>;

/**
 * Hook any function. The hook callback is passed the same `this` as the original method would have been passed,
 * meaning hookFunction can be used in prototype methods.
 */
export function hookFunction<T extends (...args: any[]) => any>(method: T, callback: HookedFunctionCallback<T>): T {
  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line ts/no-unsafe-return
    return callback.apply(this, [((...args: any[]) => method.apply(this, args)) as T, ...args]);
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
