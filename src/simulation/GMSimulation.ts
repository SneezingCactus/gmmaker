import { mod } from '../init';
import type { PlayerInput } from '../network/declarations/PlayerInput';
import type { BonkGameSettings } from '../network/declarations/GameSettings';
import type { BonkGameState } from './declarations/BonkGameState';
import { BonkStateGMExtra } from './state_gm_extra/BonkStateGMExtra';
import { hookFunction } from '../utils/hooking';
import type { b2World } from './declarations/Box2D';

export const SIMULATION_TPS = 30;

const B2_DEFAULT_MAX_TRANSLATION = 2;
const B2_DEFAULT_MAX_TRANSLATION_SQUARED = 4;
const B2_DEFAULT_MAX_ROTATION = 1.5707963267948966;
const B2_DEFAULT_MAX_ROTATION_SQUARED = 2.4674011002723395;

export function initSimulation() {
  const Box2D = mod.objectHooks.Box2D;

  Box2D.Dynamics.b2World.prototype.Step = hookFunction(Box2D.Dynamics.b2World.prototype.Step, function (
    this: b2World,
    original: b2World['Step'],
    dt: number,
    velocityIterations: number,
    positionIterations: number,
  ) {
    const state = GMSimulation.globalStepVars.inputState;
    const gmExtra = state.gmExtra;

    if (!gmExtra) {
      Box2D.Common.b2Settings.b2_maxTranslation = B2_DEFAULT_MAX_TRANSLATION;
      Box2D.Common.b2Settings.b2_maxTranslationSquared = B2_DEFAULT_MAX_TRANSLATION_SQUARED;
      Box2D.Common.b2Settings.b2_maxRotation = B2_DEFAULT_MAX_ROTATION;
      Box2D.Common.b2Settings.b2_maxRotationSquared = B2_DEFAULT_MAX_ROTATION_SQUARED;

      mod.replaceHooks.disableDeathBarrier = false;

      original(dt, velocityIterations, positionIterations);
      return;
    }

    this.m_gravity.x = gmExtra.settings.gravity[0];
    this.m_gravity.y = gmExtra.settings.gravity[1];

    Box2D.Common.b2Settings.b2_maxTranslation = gmExtra.settings.linearSpeedCap;
    Box2D.Common.b2Settings.b2_maxTranslationSquared = gmExtra.settings.linearSpeedCap ** 2;
    Box2D.Common.b2Settings.b2_maxRotation = gmExtra.settings.angularSpeedCap;
    Box2D.Common.b2Settings.b2_maxRotationSquared = gmExtra.settings.angularSpeedCap ** 2;

    mod.replaceHooks.disableDeathBarrier = gmExtra.settings.disableDeathBarrier;

    original(dt, velocityIterations, positionIterations);
  });

  class GMSimulation extends mod.objectHooks.BonkSimulation {
    public state?: BonkGameState;

    constructor() {
      super();

      (window as any).simulation = this;
    }

    static createNewState(
      players: {
        id: number;
        team: number;
      }[],
      map: any,
      seed: number,
      makeFteMuchSmaller: boolean,
      ignorePlayers: boolean[],
      gameSettings: BonkGameSettings,
      makeFteSlightlySmaller: boolean,
    ): BonkGameState {
      const newState = super.createNewState(
        players,
        map,
        seed,
        makeFteMuchSmaller,
        ignorePlayers,
        gameSettings,
        makeFteSlightlySmaller,
      );

      newState.gmExtra = BonkStateGMExtra.getDefault();

      return newState;
    }

    step(
      lastState: BonkGameState,
      inputs: PlayerInput[],
      adminInputs: unknown,
      physicsTimeStep: number,
      gameSettings: BonkGameSettings,
      numPhysicsSteps: number,
      isTutorial: boolean,
      quickPlayLobby: unknown,
    ) {
      if (!lastState.gmExtra) {
        return super.step(
          lastState,
          inputs,
          adminInputs,
          physicsTimeStep,
          gameSettings,
          numPhysicsSteps,
          isTutorial,
          quickPlayLobby,
        );
      }

      const newState = super.step(
        lastState,
        inputs,
        adminInputs,
        physicsTimeStep,
        gameSettings,
        numPhysicsSteps,
        isTutorial,
        quickPlayLobby,
      );

      newState.gmExtra = BonkStateGMExtra.clone(lastState.gmExtra);

      this.state = newState;

      mod.sandbox.getGame().world.deserialize(this.state);
      mod.sandbox.getGame().world.serialize(this.state);

      mod.replaceHooks.endStep();

      return newState;
    }
  }

  mod.objectHooks.hookBonkSimulation(GMSimulation);
}
