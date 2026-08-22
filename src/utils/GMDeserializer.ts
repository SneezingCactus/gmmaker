export default class GMDeserializer {
  protected buffer: ArrayBuffer;
  protected view: DataView;
  protected cursor: number = 0;

  protected textDecoder: TextDecoder = new TextDecoder();

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.view = new DataView(this.buffer);
  }

  setCursor(offset: number) {
    this.cursor = offset;
  }

  moveCursorBy(offset: number) {
    this.cursor += offset;
  }

  readBoolean(): boolean {
    this.cursor += 1;
    return this.view.getUint8(this.cursor - 1) > 0;
  }

  readUint32(littleEndian: boolean = false): number {
    this.cursor += 4;
    return this.view.getUint32(this.cursor - 4, littleEndian);
  }

  readInt32(littleEndian: boolean = false): number {
    this.cursor += 4;
    return this.view.getInt32(this.cursor - 4, littleEndian);
  }

  readStringSized(size: number): string {
    this.cursor += size;
    return this.textDecoder.decode(this.buffer.slice(this.cursor - size, this.cursor));
  }

  readString(): string {
    const stringSize = this.readUint32();
    return this.readStringSized(stringSize);
  }

  async readBlob(): Promise<Blob> {
    const blobSize = this.readUint32();

    this.cursor += blobSize;

    const compressedBlob = new Blob([this.buffer.slice(this.cursor - blobSize, this.cursor)]);
    const uncompressedBlobStream = compressedBlob.stream().pipeThrough(new DecompressionStream('gzip'));

    return new Response(uncompressedBlobStream).blob();
  }
}
