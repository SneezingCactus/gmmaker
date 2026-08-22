import type GMDeserializer from '../utils/GMDeserializer';
import type GMSerializer from '../utils/GMSerializer';
import { GMError } from '../utils/logging';

export enum GMModeResourceType {
  Image,
  Audio,
}

export async function deserializeModeResource(deserializer: GMDeserializer): Promise<GMModeResource> {
  const type = deserializer.readUint32();

  switch (type) {
    case GMModeResourceType.Image:
      return GMModeImageResource.deserialize(deserializer);
    case GMModeResourceType.Audio:
      return GMModeAudioResource.deserialize(deserializer);
    default:
      throw new GMError('Game mode deserialization failed: Unknown resource type');
  }
}

export abstract class GMModeResource {
  abstract readonly type: GMModeResourceType;

  async serialize(serializer: GMSerializer) {
    serializer.writeUint32(this.type);
  }
}

export class GMModeImageResource extends GMModeResource {
  readonly type = GMModeResourceType.Image;

  private blob: Blob;
  public bilinearFiltered: boolean = true;
  public repeat: boolean = false;

  constructor(blob: Blob) {
    super();
    this.blob = blob;
  }

  async serialize(serializer: GMSerializer) {
    await super.serialize(serializer);

    await serializer.writeBlob(this.blob);
    serializer.writeBoolean(this.bilinearFiltered);
    serializer.writeBoolean(this.repeat);
  }

  static async deserialize(deserializer: GMDeserializer): Promise<GMModeImageResource> {
    const resource = new GMModeImageResource(await deserializer.readBlob());

    resource.bilinearFiltered = deserializer.readBoolean();
    resource.repeat = deserializer.readBoolean();

    return resource;
  }
}

export class GMModeAudioResource extends GMModeResource {
  readonly type = GMModeResourceType.Audio;

  private blob: Blob;
  public loop: boolean = false;

  constructor(blob: Blob) {
    super();
    this.blob = blob;
  }

  async serialize(serializer: GMSerializer) {
    await super.serialize(serializer);

    await serializer.writeBlob(this.blob);
    serializer.writeBoolean(this.loop);
  }

  static async deserialize(deserializer: GMDeserializer): Promise<GMModeAudioResource> {
    const resource = new GMModeAudioResource(await deserializer.readBlob());

    resource.loop = deserializer.readBoolean();

    return resource;
  }
}
