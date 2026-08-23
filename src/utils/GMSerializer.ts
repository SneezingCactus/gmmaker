export default class GMSerializer {
  protected buffer: ArrayBuffer = new ArrayBuffer(8, { maxByteLength: 1 << 24 });
  protected view: DataView = new DataView(this.buffer);
  protected cursor: number = 0;

  protected textEncoder: TextEncoder = new TextEncoder();

  protected growBuffer() {
    this.buffer.resize(this.buffer.byteLength * 2);
  }

  protected growBufferIfNeeded(byteSizeNeeded: number) {
    if (this.buffer.byteLength - 1 < this.cursor + byteSizeNeeded)
      this.growBuffer();
  }

  getBuffer(): ArrayBuffer {
    return this.buffer;
  }

  setCursor(offset: number) {
    this.cursor = offset;
  }

  moveCursorBy(offset: number) {
    this.cursor += offset;
  }

  writeBoolean(value: boolean) {
    this.growBufferIfNeeded(1);
    this.view.setUint8(this.cursor, value ? 1 : 0);
    this.cursor += 1;
  }

  writeUint32(value: number, littleEndian: boolean = true) {
    this.growBufferIfNeeded(4);
    this.view.setUint32(this.cursor, value, littleEndian);
    this.cursor += 4;
  }

  writeInt32(value: number, littleEndian: boolean = true) {
    this.growBufferIfNeeded(4);
    this.view.setInt32(this.cursor, value, littleEndian);
    this.cursor += 4;
  }

  writeString(value: string, writeSize: boolean = true) {
    const encodedString = this.textEncoder.encode(value);

    if (writeSize)
      this.writeUint32(encodedString.byteLength);

    this.growBufferIfNeeded(encodedString.byteLength);
    new Uint8Array(this.buffer).set(encodedString, this.cursor);

    this.cursor += encodedString.byteLength;
  }

  async writeBlob(blob: Blob) {
    const compressedData = await new Response(blob.stream().pipeThrough(new CompressionStream('gzip'))).bytes();

    this.writeUint32(compressedData.byteLength);

    this.growBufferIfNeeded(compressedData.byteLength);
    new Uint8Array(this.buffer).set(compressedData, this.cursor);

    this.cursor += compressedData.byteLength;
  }
}
