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
  preloadSounds: function(soundList) {
    for (let i = 0; i < soundList.length; i++) {
      const sound = soundList[i];

      if (!sound) continue;
      if (this.customSounds[sound.id]?.hash == sound.dataHash) continue;

      if (this.customSounds[sound.id]) this.customSounds[sound.id].howl.unload();
      this.customSounds[sound.id] = {
        howl: new Howl({src: 'data:audio/' + sound.extension + ';base64,' + sound.data, gmId: sound.id}),
        hash: sound.dataHash,
      };
    }
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
    if (!gm.config.saved.ingame.allowSounds) return;
    if (BonkUtils.mute || BonkUtils.preClickMute) return;
    if (window.gmReplaceAccessors.rollbacking) {
      for (let i = 0; i < gm.audio.soundsPlaying.length; i++) {
        if (gm.audio.soundsPlaying[i]?.id === id) return;
      }
    };

    if (!Number.isFinite(volume)) return;
    if (!Number.isFinite(panning)) return;

    if (id == 'discDeath') id += Math.floor(Math.random() * 2.999);

    const soundHowl = GameResources.soundStrings[id] ? new Howl({
      src: GameResources.soundStrings[id],
      volume: volume,
      gmId: id,
    }) : this.customSounds[id]?.howl;

    if (!soundHowl) return;

    const soundId = soundHowl.play();
    soundHowl.stereo(panning, soundId);
    soundHowl.volume(volume, soundId);
  },
  customSounds: {},
  soundsPlaying: [],
  soundOverride: null,
};
