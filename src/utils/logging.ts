import pkg from '../../package.json';

export function log(message: string, ...extra: any[]) {
  // eslint-disable-next-line ts/no-unsafe-argument
  console.log(`[${pkg.displayName}] ${message}`, ...extra);
}

export function logWarn(message: string, ...extra: any[]) {
  // eslint-disable-next-line ts/no-unsafe-argument
  console.warn(`[${pkg.displayName}] ${message}`, ...extra);
}

export function logError(message: string, ...extra: any[]) {
  // eslint-disable-next-line ts/no-unsafe-argument
  console.error(`[${pkg.displayName}] ${message}`, ...extra);
}
