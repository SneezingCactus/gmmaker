/* eslint-disable camelcase */
/* eslint-disable new-cap */

export default {
  init: function() {
  },
  howls: {},
  playSound: function(soundName, volume, panning) {
    if (window.localStorage.mute === 'true') return;

    panning = Number(panning);
    volume = Number(volume);

    if (soundName == 'discDeath') soundName += Math.floor(gm.physics.pseudoRandom() * 2.999);

    if (!this.howls[soundName]) {
      this.howls[soundName] = new Howl({
        src: GameResources.soundStrings[soundName],
        volume: 1,
        loop: false,
      });
      this.howls[soundName].play();
    }

    this.howls[soundName].volume(volume);
    this.howls[soundName].stereo(panning);
    this.howls[soundName].play();
  },
};
