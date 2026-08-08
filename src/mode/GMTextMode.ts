import GMMode from './GMMode';

export default class GMTextMode extends GMMode {
  protected _code: string = '';

  code(): string {
    return this._code;
  }

  setCode(code: string) {
    this._code = code;
  }

  generateExecutable(): string {
    return this._code;
  }
}
