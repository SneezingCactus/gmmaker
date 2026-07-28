import 'ses';
import GMSandboxInternal from './GMSandboxInternal';
import type GMSandboxExternal from './GMSandboxExternal';

lockdown({
  errorTaming: 'unsafe',
});

function initSandbox(external: GMSandboxExternal): GMSandboxInternal {
  return new GMSandboxInternal(external);
}

(window as any).initSandbox = initSandbox;
