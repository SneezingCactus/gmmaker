import pkg from '../../package.json';

export function log(message: string, ...extra: any[]) {
  console.log(`[${pkg.displayName}] ${message}`, ...extra);
}

export function logWarn(message: string, ...extra: any[]) {
  console.warn(`[${pkg.displayName}] ${message}`, ...extra);
}

export function logError(message: string, ...extra: any[]) {
  console.error(`[${pkg.displayName}] ${message}`, ...extra);
}

export class GMError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(`[${pkg.displayName}] ${message}`, options);
  }
}
