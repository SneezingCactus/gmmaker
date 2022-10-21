export default {
  init: function() {
    window.Howl = (function() {
      const HowlOLD = window.Howl;
      return function(options) {
        const theSound = new HowlOLD({
          src: options.src,
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
      if (!this.soundsPlaying[i]) continue;
      this.soundsPlaying[i]?.stop();
    }
    this.soundsPlaying = [];
  },
  playSound: function(id, volume, panning) {
    if (BonkUtils.mute || BonkUtils.preClickMute) return;
    // if (window.gmReplaceAccessors.rollbacking) return;

    const theSound = new Howl({
      src: this.customSounds[id] || GameResources.soundStrings[id],
      volume: volume,
    });
    theSound.stereo(panning);
    theSound.play();

    gm.audio.soundsPlaying.push(theSound);

    const theSoundIndex = gm.audio.soundsPlaying.length - 1;

    theSound.on('end', function() {
      delete gm.audio.soundsPlaying[theSoundIndex];
    });
  },
  customSounds: {},
  soundsPlaying: [],
  soundOverride: null,
};
