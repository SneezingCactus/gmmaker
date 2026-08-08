import pkg from '../../package.json';
import { GMError } from '../utils/logging';

export default class GMMode {
  protected _savedVersion: string = pkg.version;

  savedVersion(): string {
    return this._savedVersion;
  }

  generateExecutable(): string {
    throw new GMError('Cannot generate executable from unknown type GMMode');
  };
}
