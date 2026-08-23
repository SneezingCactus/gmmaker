import type { Socket } from 'socket.io-client';
import { mod } from '../init';
import { hookFunction } from '../utils/hooking';
import type GMMode from '../mode/GMMode';
import GMDeltaMode from '../mode/GMDeltaMode';
import { BonkSocketMessageId } from './declarations/BonkNetworkEngine';
import { GMSocketMessageType } from './declarations/GMSocketMessage';
import type { GMSocketApplyModeMessage, GMSocketMessage } from './declarations/GMSocketMessage';
import GMSerializer from '../utils/GMSerializer';

function initSocketIO() {
  const derived = hookFunction(mod.objectHooks.SocketIO, (original, uri, options) => {
    const socket = original(uri, options);
    mod.network.setSocket(socket);
    return socket;
  });

  mod.objectHooks.hookSocketIO(derived);
}

export default class GMNetwork {
  protected socket?: Socket;

  protected currentMode: GMMode | null = null;

  constructor() {
    initSocketIO();
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  isHost(): boolean {
    return true;
  }

  async applyMode(newMode: GMMode) {
    if (!this.isHost())
      return;

    const deltaMode = GMDeltaMode.createFromModes(this.currentMode, newMode);

    const serializer = new GMSerializer();
    await deltaMode.serialize(serializer);

    const message: GMSocketMessage = {
      gmmaker: true,
      type: GMSocketMessageType.ApplyMode,
      newMode: serializer.getBuffer(),
    };
    this.socket?.emit(BonkSocketMessageId.PlayerInputOut as unknown as string, message);
  }
}
