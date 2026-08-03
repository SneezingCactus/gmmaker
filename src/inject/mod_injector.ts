import pkg from '../../package.json';
import { log, logError } from '../utils/logging';

enum ObjectTargetType {
  /**
   * An ES6 class.
   */
  Class,
  /**
   * A *constructor function*, pattern typically used to resemble classes in ES5.
   *
   * When hooking, the original object is exposed to the mod as a reference, and then, within Bonk's scope, it gets
   * wrapped into a Proxy of itself which deviates construction to the mod's reference.
   *
   * This means the mod can freely modify the *CtorFunction*'s prototype and "static" methods, and then reassign its
   * exposed copy to seize control of the constructor if necessary.
   *
   * Proxies come with performance costs however, so if it's not necessary to modify the *CtorFunction*'s constructor,
   * consider changing the target's type to *CtorFunctionPropsOnly*.
   */
  CtorFunction,
  /**
   * A *constructor function*, pattern typically used to resemble classes in ES5.
   *
   * When hooking, the object is exposed to the mod as a reference.
   *
   * Unlike *CtorFunction*, *CtorFunctionPropsOnly* does not wrap the object into a Proxy. This means it has zero impact
   * on performance, at the cost of losing the ability to modify its constructor.
   */
  CtorFunctionPropsOnly,
  /**
   * A *namespace*, an object with the sole purpose of holding methods and classes.
   *
   * When hooking, the object is exposed to the mod as a reference.
   */
  Namespace,
}

interface InjectorTargets {
  classes: {
    type: ObjectTargetType;
    name: string;
    regex: RegExp;
  }[];
  replace: {
    name: string;
    regex: RegExp;
    to: string;
  }[];
}

const mod = `window.${pkg.name}`;

const targets: InjectorTargets = {
  classes: [
    {
      // SocketIO library, used by Bonk to communicate with the room server.
      type: ObjectTargetType.CtorFunctionPropsOnly,
      name: 'SocketIo',
      regex: /=\(1,(...[^)]+)\).{0,100}reconnection/,
    },
    {
      // Box2D library, used by Bonk to simulate physics.
      type: ObjectTargetType.Namespace,
      name: 'Box2D',
      regex: /requirejs\(\[[^\]]+\],function\([^,]+,[^,]+,([^)]+)/,
    },
    {
      // Class in charge of simulating game steps.
      type: ObjectTargetType.CtorFunctionPropsOnly,
      name: 'BonkSimulation',
      regex: /[{};\n]([A-Za-z$_])\[.{0,100}\]=\{discs:/,
    },
    {
      // Class in charge of all in-game graphics.
      type: ObjectTargetType.Class,
      name: 'BonkGraphics',
      regex: /;([^=};]+)=class.{0,500}docu.{0,3000}TWEEN.{0,100}x:0,y/,
    },
    {
      // This class takes care of communicating with the room's server.
      type: ObjectTargetType.CtorFunctionPropsOnly,
      name: 'BonkNetwork',
      regex: /function ([^)]*)\([^)]{11}\).{0,8000}reconnection:false/,
    },
    {
      // Class in charge of updating the lobby and reacting to the player's interactions with the lobby.
      type: ObjectTargetType.CtorFunctionPropsOnly,
      name: 'BonkLobby',
      regex: /function (..)\(.{15}\).{0,20000}newbonklobby/,
    },
    {
      // Contains some useful functions (XP to level, hueify, etc) and data (your avatars, nearest server
      // for room hosting, your country, etc) used within Bonk.
      type: ObjectTargetType.Namespace,
      name: 'BonkUtils',
      regex: /(...\[[^\]]+\]).{10,20}=function\((...,){4}...\).{0,1400}0\.62/,
    },
    {
      // Unnamed general purpose class containing, among other things, the functions that begin a game session.
      type: ObjectTargetType.CtorFunction,
      name: 'GameSessionHandler',
      regex: /new (..)\(null\)/,
    },
    {
      // Class used by Bonk to compress/decompress maps.
      type: ObjectTargetType.CtorFunctionPropsOnly,
      name: 'MapEncoder',
      regex: /\{try\{.{3,6}=(.{1,2})\[/,
    },
    {
      // Class in charge of handling ingoing and outgoing player input.
      type: ObjectTargetType.Class,
      name: 'InputHandler',
      regex: /Date.{0,100}new ([^(]+).{0,100}\$\(document/,
    },
    {
      // Class containing a list of all the available modes.
      type: ObjectTargetType.Class,
      name: 'ModeList',
      regex: /[}{;]([\w$]{3}\[\d{0,10}\])=class.{0,1000}=\{lobbyName/,
    },
  ],
  replace: [
    // make step function not delete the world's bodies and instead put that code into a global function
    {
      name: 'detachEndStep',
      regex: /(for\(([^\]]+\]){4}\]\(.{0,400}\}[A-Za-z$_]([^\]]+\]){2}\]=undefined;)/,
      to: `${mod}.replaceHooks.endStep = () => {$1};`,
    },
    // make game length globally accessible
    {
      name: 'exposeGameLength',
      regex: /(< 100\D.{0,100}\+ 1.{0,1500}\}([^+]+)\+\+;)/,
      to: `$1${mod}.replaceHooks.gameLength = $2;`,
    },
    // allow forcing of input registering (normally new inputs are only registered when a key transitions
    // from pressed to released and vice versa)
    {
      name: 'inputRegisterControl',
      regex: /(>= 0;.{0,100}--.{0,300}break;\}.{0,200}?if\()([^{]{0,200}\{)(.{0,1500}\{i:.{0,100}f:)/,
      to: `$1${mod}.replaceHooks.forceInputRegister || $2${mod}.replaceHooks.forceInputRegister = false;$3`,
    },
    // let gmmaker know when the game is being rollbacked for sound handling
    {
      name: 'exposeRollbacking',
      regex: /if\(([^ ]+ != Infinity.{0,1000}?\)\{)(for[^<]+< [^\]]+\].{0,400}=Infinity;)/,
      to: `if($1${mod}.replaceHooks.rollbacking = true;$2${mod}.replaceHooks.rollbacking = false;`,
    },
    // allow toggling of the death barrier
    {
      name: 'deathBarrierToggle',
      regex: /(for.{0,100}if\()(.{0,1200} == false &&.{0,100}> .{0,100}850)/,
      to: `$1!${mod}.replaceHooks.disableDeathBarrier && $2`,
    },
    // modify position of sound with camera position
    {
      name: '',
      regex: /(=Math.{0,30}Math.{0,30}\(1[^,]{0,10},)([^,]{0,10}),-1/g,
      to: `$1(${mod}.replaceHooks.multToStereo ?? 1) * ((${mod}.replaceHooks.addToStereo ?? 0) + $2), -1`,
    },
    // remove pixi render function at the end of BonkGraphics render function to allow gmm to do stuff before rendering
    {
      name: 'doNotRender',
      regex: /(this.renderer.render\(this.stage\);)/,
      to: '/*$1*/',
    },
    // add missing existence checks where needed
    {
      name: 'physicsShapesExistenceCheck',
      regex: /(ppm:.{0,1000}if\(([^\]]+\]).{0,100}<= 0\)\{.{0,100}for\(([^\]]+\]).{0,200}\+\+\)\{)/,
      to: '$1if(!$2.physics.shapes[$3]) continue;',
    },
    {
      name: 'graphicsFirstRodJointExistenceCheck',
      regex: /(updateRodJoints.{0,100} ([^=]+)=\[argu.{0,2000}?;([^;+]+)\+\+\)\{)/,
      to: '$1if($2[0][0].physics.joints[$3]?.type !== "d") continue;',
    },
    // extend top bar visibility range
    {
      name: 'extendTopBarReach',
      regex: /(return.{0,1000})< [^ ]{0,10}(.{0,100}ime.{0,200}?rue,du.+?> )[^ ]{0,10}/,
      to: '$1< 100$2100',
    },
    // allow round to end when requested by the mode
    {
      name: 'roundEndControl',
      regex: /(1,did:.{0,1000}?== 0)/,
      to: `$1 || ${mod}.replaceHooks.endRound`,
    },
  ],
};

const functionHookRegex = /(\}+(\)+)?;?)(function .{5,8}\(\)\{retur|$)/m;

(window as any)[pkg.name] = {
  objectHooks: {},
  replaceHooks: {},
};

function inject(src: string): string {
  log('Injecting alpha2s.js...');

  let classHooks = '';

  for (const objectTarget of targets.classes) {
    const match = src.match(objectTarget.regex);

    if (!match) {
      logError('Regex FAILED for function target', objectTarget);
      throw new Error(`[${pkg.displayName}] Injection error`);
    }

    const bonkObjectName = match[1];

    switch (objectTarget.type) {
      case ObjectTargetType.Class:
        classHooks += [
          `${mod}.objectHooks.${objectTarget.name} = ${bonkObjectName};`,
          `${bonkObjectName} = function() {`,
          `  if (!${mod}.objectHooks.derived${objectTarget.name}) {`,
          `    console.log('[${pkg.displayName}] No derived hook for class ${objectTarget.name}, ignoring');`,
          `    return new ${mod}.objectHooks.${objectTarget.name}(...arguments);`,
          '  }',

          `  return new ${mod}.objectHooks.derived${objectTarget.name}(...arguments);`,
          '};',
          `Object.assign(${bonkObjectName}, ${mod}.objectHooks.${objectTarget.name});`,
        ].join('');
        break;

      case ObjectTargetType.CtorFunction:
        classHooks += [
          `${mod}.objectHooks.${objectTarget.name} = ${bonkObjectName};`,
          `${bonkObjectName} = new Proxy(${bonkObjectName}, {`,
          '  construct(target, args) {',
          `    return new ${mod}.objectHooks.${objectTarget.name}(...args);`,
          '  }',
          `});`,
        ].join('');
        break;

      case ObjectTargetType.CtorFunctionPropsOnly:
      case ObjectTargetType.Namespace:
        classHooks += [
          `${mod}.objectHooks.${objectTarget.name} = ${bonkObjectName};`,
        ].join('');
        break;
    }

    /*
    classHooks += [
      `window.${pkg.name}.functionHooks.${functionTarget.name} = ${bonkFunction};`,
      `window.${pkg.name}.functionHooks.${functionTarget.name}OLD = ${bonkFunction};`,
      `${bonkFunction} =`,
    ].join(''); */

    /*
    if (functionTarget.isClass) {
      functionHooks += [
        `new Proxy(${bonkFunction}, {`,
        '  construct(target, args) {',
        `    return new ${mod}.functionHooks.${functionTarget.name}(...args);`,
        '  }',
        '});',
      ].join('\n');
    }
    else {
      functionHooks += [
        'function() {',
        `  return ${mod}.functionHooks.${functionTarget.name}(...arguments);`,
        '};',
      ].join('\n');
    } */
  }

  src = src.replace(functionHookRegex, [
    classHooks,
    `if (${mod}.init) {`,
    `  ${mod}.init();`,
    '} else {',
    '  let waitInitInterval;',
    '  waitInitInterval = setInterval(() => {',
    `    if (!${mod}.init) return;`,
    `    ${mod}.init();`,
    '    clearInterval(waitInitInterval);',
    '  }, 500)',
    '}',
    '$1$3',
  ].join('\n'));

  for (const replaceTarget of targets.replace) {
    if (!replaceTarget.regex.test(src)) {
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
