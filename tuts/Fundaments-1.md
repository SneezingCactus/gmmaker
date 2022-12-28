# Events

Events are the foundation of a GMMaker mode. They allow it to react to the world and modify it as the mode considers necessary.

With `game.events.addEventListener()`, you can assign a function (a listener) to an event, in such a way that the function will execute every time the event occurs. Most events have options that let you choose how and/or when the function is executed. Note that you can have more than a single listener for an event.

There are 6 different events:

- `roundStart`: Executes every time a new round starts, i.e. at the start of the game and after each score.
- `step`: Executes every time a game step occurs (30 times per second).

These two events have an option called `perPlayer` that allows you to make the event listener execute multiple times, each time giving the listener a different player ID. This is meant to aid with managing players differently from one another, without the need of for loops.

Example usage:
```javascript
game.events.addEventListener('roundStart', {perPlayer: false}, function() {
  // executes on round start, and only once

  // hello world!
  game.debugLog('A new round has started!');
});

game.events.addEventListener('step', {perPlayer: true}, function(id) {
  // executes on each step, and for every player

  // discs go spinny
  if (game.state.discs[id]) game.state.discs[id].a += game.state.discs[id].lv[0];
});
```

***

- `playerDie`: Executes when a player dies. It gives the listener both the ID of the player that died and the discDeath corresponding to that death.

This event has no options.

Example usage:

```javascript
game.events.addEventListener('playerDie', null, function(discId, deathId) {
  // executes when a player dies
  
  // gg ez stay mad
  game.debugLog('Whoops! Looks like ' +
    game.lobby.playerInfo[discId].userName +
    ' just fell into the void. What a shame.');
});
```

***

- `discCollision`: Executes when a disc collides with something.
- `arrowCollision`: Executes when an arrow collides with something.
- `bodyCollision`: Executes when a body collides with something.

These three events have an option called `collideWith`. It lets you specify with what type of object a disc/arrow/body should collide with in order to execute the listener.

The listener is given two variables, each representing one side of the collision. According to the event and the `collideWith` specified, the variables given to the listener are different.

A side of the collision involving a disc or an arrow will simply give the ID of this object, as a number.

A side of the collision involving a body, however, will be an object, containing information such as the ID of the body itself, the ID of the specific fixture hit, etc. The documentation explains every single one in further detail.

Example usage:

```javascript
game.events.addEventListener('discCollision', {collideWith: 'arrow'}, function(discId, arrowId) {
  // executes when a disc collides with an arrow

  // kill them both!
  game.world.killDisc(discId);
  delete game.state.projectiles[arrowId];
});

game.events.addEventListener('arrowCollision', {collideWith: 'arrow'}, function(arrowId, otherArrowId) {
  // executes when an arrow collides with another arrow

  // make them invisible!
  game.state.projectiles[arrowId].visible = false;
  game.state.projectiles[otherArrowId].visible = false;
});

game.events.addEventListener('bodyCollision', {collideWith: 'disc'}, function(bodyInfo, discId) {
  // executes when a body collides with a disc

  // paint it all!
  game.state.physics.fixtures[bodyInfo.fixtureId].f = 
    game.lobby.playerInfo[discId].skinBg;
});
```