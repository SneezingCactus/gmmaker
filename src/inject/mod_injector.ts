import pkg from '../../package.json';
import { log, logError } from '../utils/logging';

interface InjectorTargets {
  functions: {
    name: string;
    regex: RegExp;
    isClass: boolean;
  }[];
  replace: {
    name: string;
    regex: string;
    to: string;
  }[];
}

const targets: InjectorTargets = {
  functions: [],
  replace: [],
};

const functionHookRegex = /(\}+(\)+)?;?)(function .{5,8}\(\)\{retur|$)/m;

(window as any)[pkg.name] = {
  functions: {},
};

function inject(src: string): string {
  log('Injecting alpha2s.js...');

  let functionHooks = '';

  for (const functionTarget of targets.functions) {
    const match = src.match(functionTarget.regex);

    if (!match) {
      logError('Regex FAILED for function target', functionTarget);
      throw new Error(`[${pkg.displayName}] Injection error`);
    }

    const bonkFunction = match[1];

    functionHooks += [
      `window.${pkg.name}.functions.${functionTarget.name} = ${bonkFunction};`,
      `window.${pkg.name}.functions.${functionTarget.name}OLD = ${bonkFunction};`,
      `${bonkFunction} =`,
    ].join('');

    if (functionTarget.isClass) {
      functionHooks += [
        `new Proxy(${bonkFunction}, {`,
        '  construct(target, args) {',
        `    return new window.${pkg.name}.functions.${functionTarget.name}(...args);`,
        '  }',
        '};',
      ].join('\n');
    }
    else {
      functionHooks += [
        'function() {',
        `  return window.${pkg.name}.functions.${functionTarget.name}(...arguments);`,
        '};',
      ].join('\n');
    }
  }

  src = src.replace(functionHookRegex, [
    functionHooks,
    `if (window.${pkg.name}.init) {`,
    `  window.${pkg.name}.init();`,
    '} else {',
    '  let waitInitInterval;',
    '  waitInitInterval = setInterval(() => {',
    `    if (!window.${pkg.name}.init) return;`,
    `    window.${pkg.name}.init();`,
    '    clearInterval(waitInitInterval);',
    '  }, 500)',
    '}',
    '$1$3',
  ].join('\n'));

  for (const replaceTarget of targets.replace) {
    if (!src.match(replaceTarget.regex)) {
      logError('Regex FAILED for replace target', replaceTarget);
      throw new Error(`[${pkg.displayName}] Injection error`);
    }

    src = src.replace(
      replaceTarget.regex,
      [
        `/* [${pkg.name}] ${replaceTarget.name} REPLACE START */ `,
        replaceTarget.to,
        ` /* [${pkg.name}] ${replaceTarget.name} REPLACE END */`,
      ].join(''),
    );
  }

  return src;
}

(window as any).bonkCodeInjectors ??= [];
(window as any).bonkCodeInjectors.push(inject);

log('Injector loaded');
