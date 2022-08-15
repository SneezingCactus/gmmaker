/**
 * to avoid clutter
 * @param {*} object
 * @return {*}
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

// pretty self-explanatory
window.getStaticInfo = (game) => {
  Object.assign(game, copy(window.parent.gm.state.staticInfo));
};
harden(getStaticInfo);

window.getDynamicInfo = (game) => {
  const copied = copy({
    state: window.parent.gm.state.gameState,
    inputs: window.parent.gm.state.inputs,
  });

  game.state = copied.state;
  game.inputs = copied.inputs;

  const gmExtra = copied.state.gmExtra;

  game.vars = gmExtra.vars;
  game.inputs.overrides = gmExtra.overrides;
  game.graphics.camera = gmExtra.camera;
  game.graphics.drawings = gmExtra.drawings;
};
harden(getDynamicInfo);

// get list of arguments coming from event fire
window.getEventArgs = () => copy(window.parent.gm.state.currentEventArgs);
harden(getEventArgs);

// get random number
// the 0 part is to make it adapt to sandbox prototypes
window.getRandom = () => 0 + window.parent.gm.state.pseudoRandom();
harden(getRandom);

// return list of methods
['getStaticInfo', 'getDynamicInfo', 'getEventArgs', 'getRandom'];
