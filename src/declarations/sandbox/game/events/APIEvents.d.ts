interface APIEventsStepOptions {
  /**
   * Indicates whether the listener will be called once, or if it will be called once for every player in the game.
   *
   * The goal of this option is to facilitate self-interaction within a player, when needed (for example, to add new
   * player abilities, or to draw player-specific HUD).
   *
   * This option only affects "roundStart" and "step".
   *
   * If set to true, the listener will be called multiple times, and it will be given the ID of a different player
   * every time, by ascending order. For example: if there are two players, one with ID 2 and another with ID 5,
   * the function will be called twice; the first time it will be given the ID 2, then the other time, the ID 5.
   *
   * If set to false, the listener will be called once, and no variables will be given.
   */
  perPlayer: boolean;
}

interface APIEventsCollisionOptions {
  /**
   * Indicates what collision needs to happen for the event to fire: collision with a disc, an arrow or a platform.
   */
  collideWith: 'disc' | 'arrow' | 'platform';
}

interface APIEventsCollisionPlatformInfo {
  /**
   * ID of the platform hit.
   */
  id: number;
  /**
   * ID of the shape hit.
   */
  shapeId: number;
  /**
   * A 2d vector with a length of 1 that represents the direction of the face hit by the other object.
   */
  normal: vector2d;
}

interface APIEventOptions {
  roundStart: APIEventsStepOptions;
  step: APIEventsStepOptions;

  playerDie: null;

  discCollision: APIEventsCollisionOptions;
  arrowCollision: APIEventsCollisionOptions;
  platformCollision: APIEventsCollisionOptions;
}

interface APIEventBaseListenerArgs {
  roundStart: [];
  step: [];

  playerDie: [id: number];

  discCollision: [discId: number];
  arrowCollision: [arrowId: number];
  platformCollision: [platformInfo: APIEventsCollisionPlatformInfo];
}

type APIEventAdditionalListenerArgs<T extends keyof APIEventOptions, O extends APIEventOptions[T]>
  = O extends { perPlayer: true } ? [id: number]
    : O extends { collideWith: 'disc' | 'arrow' } ? [collisionId: number]
      : O extends { collideWith: 'platform' } ? [collisionInfo: APIEventsCollisionPlatformInfo]
        : [];

type APIEventListenerArgs<T extends keyof APIEventOptions, O extends APIEventOptions[T]> = [
  ...APIEventBaseListenerArgs[T],
  ...APIEventAdditionalListenerArgs<T, O>,
];

export interface APIEvents {
  /**
   * Attach a function (listener) to an event. This function will be called when the event happens. An event can have
   * multiple listeners attached to it.
   *
   * Read more about events [here](https://sneezingcactus.github.io/gmmaker/docs/tutorials/Fundaments-1.html).
   *
   * @param eventType - The type of event to attach the listener to.
   * @param options - Unique options to change when and how the listener will be called.
   * @param listener - The function to attach.
   */
  addEventListener: <T extends keyof APIEventOptions, O extends APIEventOptions[T]>(
    eventType: T,
    options: O,
    listener: (...args: APIEventListenerArgs<T, O>) => void,
  ) => any;
}
