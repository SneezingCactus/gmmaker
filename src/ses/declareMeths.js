/**
 * to avoid clutter
 * @param {*} object
 * @return {*}
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

// pretty self-explanatory, only gets used when calling events
window.getDynamicInfo = () => copy({state: window.parent.gm.state.gameState, inputs: window.parent.gm.state.currentInputs});
harden(getDynamicInfo);

// get list of arguments coming from event fire
window.getEventArgs = () => copy(window.parent.gm.state.currentEventArgs);
harden(getEventArgs);

// return list of methods
['getDynamicInfo', 'getEventArgs'];
