export default {
  init: function() {
  },
  compressMode: function(mode) {
    const compressedMode = new dcodeIO.ByteBuffer();

    /* #region APPEND IMAGES */
    const imagesData = [];

    for (let i = 0; i < mode.assets.images.length; i++) {
      if (!mode.assets.images[i]) continue;

      const data = mode.assets.images[i].data;
      mode.assets.images[i].data = null;
      imagesData[i] = data;

      const bufferedData = dcodeIO.ByteBuffer.fromBase64(data);

      compressedMode.writeUInt16(i);
      compressedMode.writeUInt32(bufferedData.buffer.byteLength);

      // because of some base64 padding related thing, sometimes
      // the offset after appending asset data is not the same
      // as the byteLength of the asset data buffer, this fixes that
      const offsetBefore = compressedMode.offset;

      compressedMode.append(bufferedData);

      while (compressedMode.offset < offsetBefore + bufferedData.buffer.byteLength) {
        compressedMode.writeByte(0);
      }
      compressedMode.offset = offsetBefore + bufferedData.buffer.byteLength;
    }

    compressedMode.writeUInt16(32767);
    /* #endregion APPEND IMAGES */

    /* #region APPEND SOUNDS */
    const soundsData = [];

    for (let i = 0; i < mode.assets.sounds.length; i++) {
      if (!mode.assets.sounds[i]) continue;

      const data = mode.assets.sounds[i].data;
      mode.assets.sounds[i].data = null;
      soundsData[i] = data;

      const bufferedData = dcodeIO.ByteBuffer.fromBase64(data);

      compressedMode.writeUInt16(i);
      compressedMode.writeUInt32(bufferedData.buffer.byteLength);

      // because of some base64 padding related thing, sometimes
      // the offset after appending asset data is not the same
      // as the byteLength of the asset data buffer, this fixes that
      const offsetBefore = compressedMode.offset;

      compressedMode.append(bufferedData);

      while (compressedMode.offset < offsetBefore + bufferedData.buffer.byteLength) {
        compressedMode.writeByte(0);
      }
      compressedMode.offset = offsetBefore + bufferedData.buffer.byteLength;
    }

    compressedMode.writeUInt16(32767);
    /* #endregion APPEND SOUNDS */

    const compressedCode = LZString.compressToUint8Array(JSON.stringify(mode));

    compressedMode.writeUInt32(compressedCode.byteLength);
    compressedMode.append(compressedCode);

    for (let i = 0; i < mode.assets.images.length; i++) {
      if (!mode.assets.images[i]) continue;
      mode.assets.images[i].data = imagesData[i];
    }
    for (let i = 0; i < mode.assets.sounds.length; i++) {
      if (!mode.assets.sounds[i]) continue;
      mode.assets.sounds[i].data = soundsData[i];
    }

    return compressedMode;
  },
  decompressMode: function(modeBuf) {
    modeBuf.offset = 0;

    const imagesData = [];

    while (true) {
      const index = modeBuf.readUInt16();

      if (index == 32767) break;

      const byteLength = modeBuf.readUInt32();

      imagesData.push(modeBuf.toBase64(modeBuf.offset, modeBuf.offset + byteLength));
      modeBuf.offset += byteLength;
    }

    const soundsData = [];

    while (true) {
      const index = modeBuf.readUInt16();

      if (index == 32767) break;

      const byteLength = modeBuf.readUInt32();

      soundsData.push(modeBuf.toBase64(modeBuf.offset, modeBuf.offset + byteLength));
      modeBuf.offset += byteLength;
    }

    const codeLength = modeBuf.readUInt32();

    const compressedCode = new Uint8Array(modeBuf.copy(modeBuf.offset, modeBuf.offset + codeLength).buffer);
    modeBuf.offset += codeLength;

    const resultMode = JSON.parse(LZString.decompressFromUint8Array(compressedCode));

    for (let i = 0; i < imagesData.length; i++) {
      if (!imagesData[i] || !resultMode.assets.images[i]) continue;
      resultMode.assets.images[i].data = imagesData[i];
    }
    for (let i = 0; i < soundsData.length; i++) {
      if (!soundsData[i] || !resultMode.assets.sounds[i]) continue;
      resultMode.assets.sounds[i].data = soundsData[i];
    }

    return resultMode;
  },
};
