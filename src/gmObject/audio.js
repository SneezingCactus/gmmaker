export default {
  init: function() {
    window.Howl = (function() {
      const HowlOLD = window.Howl;
      return function(options) {
        const theSound = new HowlOLD({
          src: gm.audio.soundOverride ?? options.src,
          volume: options.volume,
          loop: options.loop,
        });
        gm.audio.soundsPlaying.push(theSound);
        const theSoundIndex = gm.audio.soundsPlaying.length - 1;

        theSound.on('end', function() {
          delete gm.audio.soundsPlaying[theSoundIndex];
        });

        return theSound;
      };
    })();
  },
  preloadSounds: function(soundList) {
    for (let i = 0; i < soundList.length; i++) {
      const sound = soundList[i];
      if (!sound) continue;

      this.customSounds[sound.id] = 'data:audio/' + sound.extension + ';base64,' + sound.data;
    }
  },
  stopAllSounds: function() {
    for (let i = 0; i < this.soundsPlaying.length; i++) {
      this.soundsPlaying[i]?.stop();
    }
    this.soundsPlaying = [];
  },
  playSound: function(id, volume, panning) {
    this.soundOverride = this.customSounds[id];
    BonkUtils.soundManager.playSound(id, panning, volume);
    this.soundOverride = null;
  },
  customSounds: {},
  soundsPlaying: [],
  soundOverride: null,
};
