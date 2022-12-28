# Drawings

Drawings let you add to the visual experience of the game, allowing you to, for example, create a heads-up display, give players cosmetics, add visual effects like explosions, even change the scenery entirely.

GMMaker v1.0's drawing system is much different from previous versions' drawing system. Instead of drawing into a canvas and clearing it to redraw, you now define **drawings** which are containers for **shapes**, and you can modify them or delete them afterwards.

Shapes are objects that define a graphic, like a rectangle or a polygon. There are six types of shapes:

- `bx`: A box, a rectangle.
- `ci`: An circle, an ellipse.
- `po`: A polygon.
- `li`: A line.
- `tx`: Text.
- `im`: An image.

Further explanation of the unique properties of each one of these shape types can be found in the in-game documentation.

In a way, drawings are like bodies: They have their own spatial properties such as position and angle, which affects their children (fixtures in bodies, shapes in drawings), and these children can have their own position relative to their container.

Drawings need to be attached to a space to be visible to the player. This is done with the `attachTo` and `attachId` properties of the drawing. There are four kinds of spaces:

- `attachTo: 'screen'` will attach the drawing to screen space. This means the drawing will not move from its spot when you do any changes to the camera. This is useful for heads-up displays and other types of user interfaces.
- `attachTo: 'world'` will attach the drawing to world space. This means the drawing is positioned in the world, and therefore will be affected by camera manipulation and shaking, like everything else in it (discs, bodies, etc).
- `attachTo: 'disc'` with `attachId: discId` will attach the drawing to the specified disc. This simply means it will move and rotate with the disc. When the disc dies, the drawings attached to it will disappear, however they will not be removed from the drawings array.
- `attachTo: 'body'` with `attachId: bodyId` will attach the drawing to the specified body. They behave exactly like drawings attached to discs.

Example usage:

```js
// This creates a drawing attached to a disc, containing a white line shape
// that points towards the disc's direction (based on its velocity).

game.events.addEventListener('roundStart', {perPlayer: true}, function(id) {
  // make sure this player has a disc
  if (!game.state.discs[id]) return;

  // make an object in game.vars that will contain the variables of this specific player
  game.vars[id] = {};

  // create the drawing, and store the return id in a variable called drawingId
  game.vars[id].drawingId = game.graphics.createDrawing({
    alpha: 1,
    pos: [0, 0],
    angle: 0,
    scale: [1, 1],
    attachTo: 'disc',
    attachId: id,
    isBehind: false,
    shapes: [{
      type: 'li',
      colour: 0xffffff,
      alpha: 1,
      pos: [0, 0],
      end: [0, 0],
      width: 0.5
    }]
  });
});

game.events.addEventListener('step', {perPlayer: true}, function(id) {
  // make sure this player's disc still exists
  if (!game.state.discs[id]) return;
  
  // store the drawing in a variable for better readability (optional)
  const drawing = game.graphics.drawings[game.vars[id].drawingId];

  // set the end point of the line shape to the disc's linear velocity,
  // normalized to always have a length of 1
  drawing.shapes[0].end = Vector.normalize(game.state.discs[0].lv);
});
```