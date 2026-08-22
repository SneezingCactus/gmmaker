import type GMDeserializer from '../utils/GMDeserializer';
import type GMSerializer from '../utils/GMSerializer';
import { GMError } from '../utils/logging';
import type GMMode from './GMMode';
import { deserializeModeCode } from './GMModeCode';
import type { GMModeCode } from './GMModeCode';
import GMModeMetadata from './GMModeMetadata';
import { deserializeModeResource } from './GMModeResource';
import type { GMModeResource } from './GMModeResource';

const DELTA_MODE_MAGIC_HEADER = 'GMDELTAMODE';

/**
 * Represents a game mode update, or the difference between two game modes. Used to send any changes made to the
 * current game mode in a lobby to all players, without having to re-send the entire game mode every time.
 */
export default class GMDeltaMode {
  readonly metadata: GMModeMetadata;
  readonly resources: Map<string, GMModeResource | null>;
  readonly code: GMModeCode;

  private constructor(metadata: GMModeMetadata, resources: Map<string, GMModeResource | null>, code: GMModeCode) {
    this.metadata = metadata;
    this.resources = resources;
    this.code = code;
  }

  static createFromModes(oldMode: GMMode, newMode: GMMode): GMDeltaMode {
    const resources: Map<string, GMModeResource | null> = new Map(newMode.resources);

    // add null values to resource ids that exist in old mode but not in new mode
    for (const resourceId of oldMode.resources.keys()) {
      if (newMode.resources.has(resourceId))
        continue;

      resources.set(resourceId, null);
    }

    return new GMDeltaMode(newMode.metadata, resources, newMode.code);
  }

  async serialize(serializer: GMSerializer) {
    serializer.writeString(DELTA_MODE_MAGIC_HEADER, false);

    this.metadata.serialize(serializer);

    serializer.writeUint32(this.resources.size);
    for (const [id, resource] of this.resources) {
      serializer.writeString(id);

      if (resource) {
        serializer.writeBoolean(true);
        await resource.serialize(serializer);
      }
      else {
        serializer.writeBoolean(false);
      }
    }

    this.code.serialize(serializer);
  }

  static async deserialize(deserializer: GMDeserializer): Promise<GMDeltaMode> {
    const magicHeader = deserializer.readStringSized(DELTA_MODE_MAGIC_HEADER.length);

    if (magicHeader !== DELTA_MODE_MAGIC_HEADER)
      throw new GMError('Delta mode deserialization failed: Magic header does not match');

    const metadata = GMModeMetadata.deserialize(deserializer);
    const resources: Map<string, GMModeResource | null> = new Map();

    const numResources = deserializer.readUint32();
    for (let i = 0; i < numResources; i++) {
      const id = deserializer.readString();

      if (deserializer.readBoolean()) {
        resources.set(id, await deserializeModeResource(deserializer));
      }
      else {
        resources.set(id, null);
      }
    }

    const code = deserializeModeCode(deserializer);

    return new GMDeltaMode(metadata, resources, code);
  }
}
