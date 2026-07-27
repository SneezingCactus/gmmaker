import pkg from '../package.json';
import { log } from './utils/logging';

interface Mod {
  // ideally this should be properly typed to match the hooked functions
  // eslint-disable-next-line ts/no-unsafe-function-type
  functions: Record<string, Function>;

  // add any accessors here...

  init: () => void;
}

export const mod: Mod = (window as any)[pkg.name];

function init() {
  log('Hello from init!');
}

mod.init = init;
