import pkg from '../../package.json';
import type GMDeserializer from '../utils/GMDeserializer';
import type GMSerializer from '../utils/GMSerializer';
import { GMError } from '../utils/logging';
import { deserializeModeCode, GMModeJavaScriptCode } from './GMModeCode';
import type { GMModeCode } from './GMModeCode';
import GMModeMetadata from './GMModeMetadata';
import { deserializeModeResource } from './GMModeResource';
import type { GMModeResource } from './GMModeResource';

const MODE_MAGIC_HEADER = 'GMMODE';

export default class GMMode {
  metadata: GMModeMetadata = new GMModeMetadata();
  resources: Map<string, GMModeResource> = new Map();
  code: GMModeCode = new GMModeJavaScriptCode();

  async serialize(serializer: GMSerializer) {
    serializer.writeString(MODE_MAGIC_HEADER, false);
    serializer.writeString(pkg.version);

    this.metadata.serialize(serializer);

    serializer.writeUint32(this.resources.size);
    for (const [id, resource] of this.resources) {
      serializer.writeString(id);
      await resource.serialize(serializer);
    }

    this.code.serialize(serializer);
  }

  static async deserialize(deserializer: GMDeserializer): Promise<GMMode> {
    const magicHeader = deserializer.readStringSized(MODE_MAGIC_HEADER.length);

    if (magicHeader !== MODE_MAGIC_HEADER)
      throw new GMError('Game mode deserialization failed: Magic header does not match');

    const mode = new GMMode();

    deserializer.readString(); // saved version. does nothing currently

    mode.metadata = GMModeMetadata.deserialize(deserializer);

    const numResources = deserializer.readUint32();
    for (let i = 0; i < numResources; i++) {
      mode.resources.set(deserializer.readString(), await deserializeModeResource(deserializer));
    }

    mode.code = deserializeModeCode(deserializer);

    return mode;
  }
}
