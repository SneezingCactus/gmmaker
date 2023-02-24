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
        gm.audio.soundsPlaying.push({
          id: options.gmId,
          howl: theSound,
        });
        const theSoundIndex = gm.audio.soundsPlaying.length - 1;

        theSound.on('end', function() {
          delete gm.audio.soundsPlaying[theSoundIndex];
        });
        theSound.on('play', function() {
          gm.audio.soundsPlaying.push({
            id: options.gmId,
            howl: theSound,
          });
        });

        return theSound;
      };
    })();
  },
  stopAllSounds: function() {
    for (let i = 0; i < this.soundsPlaying.length; i++) {
      if (!this.soundsPlaying[i]) continue;
      if (this.soundsPlaying[i].howl._src?.includes('sound/')) continue;
      this.soundsPlaying[i].howl._emit('end');
      this.soundsPlaying[i].howl.stop();
    }
    this.soundsPlaying = [];
  },
  playSound: function(id, volume = 0.5, panning = 0) {
    // if (!gm.config.saved.ingame.allowSounds) return;
    if (BonkUtils.mute || BonkUtils.preClickMute) return;
    if (window.gmReplaceAccessors.rollbacking) {
      for (let i = 0; i < gm.audio.soundsPlaying.length; i++) {
        if (gm.audio.soundsPlaying[i]?.id === id) return;
      }
    };

    if (!Number.isFinite(volume) || Number.isNaN(volume) || typeof volume !== 'number') return;
    if (!Number.isFinite(panning) || Number.isNaN(panning) || typeof panning !== 'number') return;

    if (!GameResources.soundStrings[id]) return;

    const soundHowl = new Howl({
      src: GameResources.soundStrings[id],
      volume: volume,
      gmId: id,
    });

    const soundId = soundHowl.play();
    soundHowl.stereo(panning, soundId);
    soundHowl.volume(volume, soundId);
  },
  soundsPlaying: [],
  soundOverride: null,
};
