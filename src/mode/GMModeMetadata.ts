import type GMDeserializer from '../utils/GMDeserializer';
import type GMSerializer from '../utils/GMSerializer';
import { GMError } from '../utils/logging';

export default class GMModeMetadata {
  static readonly NAME_MAX_LENGTH = 12;
  static readonly DESCRIPTION_MAX_LENGTH = 500;

  private _name: string = 'Custom';
  private _description: string = 'Change your mode\'s description on the Game Mode Editor\'s Mode Settings menu.';
  // protected baseMode: string | null = null;

  get name() {
    return this._name;
  }

  set name(newName: string) {
    if (newName.length > GMModeMetadata.NAME_MAX_LENGTH)
      throw new GMError(`Mode name cannot be longer than ${GMModeMetadata.NAME_MAX_LENGTH} characters`);

    this._name = newName;
  }

  get description() {
    return this._description;
  }

  set description(newDescription: string) {
    if (newDescription.length > GMModeMetadata.DESCRIPTION_MAX_LENGTH)
      throw new GMError(`Mode description cannot be longer than ${GMModeMetadata.DESCRIPTION_MAX_LENGTH} characters`);

    this._description = newDescription;
  }

  serialize(serializer: GMSerializer) {
    serializer.writeString(this._name);
    serializer.writeString(this._description);
  }

  static deserialize(deserializer: GMDeserializer): GMModeMetadata {
    const metadata = new GMModeMetadata();

    metadata.name = deserializer.readString();
    metadata.description = deserializer.readString();

    return metadata;
  }
}
