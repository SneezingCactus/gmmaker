import type GMDeserializer from '../utils/GMDeserializer';
import type GMSerializer from '../utils/GMSerializer';
import { GMError } from '../utils/logging';

export enum GMModeCodeType {
  Blockly,
  JavaScript,
  TypeScript,
}

export function deserializeModeCode(deserializer: GMDeserializer): GMModeCode {
  const type = deserializer.readUint32();

  switch (type) {
    case GMModeCodeType.JavaScript:
      return GMModeJavaScriptCode.deserialize(deserializer);
    case GMModeCodeType.TypeScript:
      return GMModeTypeScriptCode.deserialize(deserializer);
    default:
      throw new GMError('Game mode deserialization failed: Unknown code type');
  }
}

export abstract class GMModeCode {
  abstract readonly type: GMModeCodeType;

  abstract generateExecutable(): string;

  serialize(serializer: GMSerializer): void {
    serializer.writeUint32(this.type);
  }
}

export class GMModeJavaScriptCode extends GMModeCode {
  readonly type = GMModeCodeType.JavaScript;

  content: string;

  constructor(code: string = '') {
    super();
    this.content = code;
  }

  generateExecutable(): string {
    return this.content;
  }

  serialize(serializer: GMSerializer) {
    super.serialize(serializer);
    serializer.writeString(this.content);
  }

  static deserialize(deserializer: GMDeserializer) {
    return new GMModeJavaScriptCode(deserializer.readString());
  }
}

export class GMModeTypeScriptCode extends GMModeCode {
  readonly type = GMModeCodeType.TypeScript;

  content: string;

  constructor(code: string = '') {
    super();
    this.content = code;
  }

  generateExecutable(): string {
    return this.content;
  }

  serialize(serializer: GMSerializer) {
    super.serialize(serializer);
    serializer.writeString(this.content);
  }

  static deserialize(deserializer: GMDeserializer) {
    return new GMModeTypeScriptCode(deserializer.readString());
  }
}
