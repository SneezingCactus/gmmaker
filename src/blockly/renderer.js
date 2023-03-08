/* eslint-disable require-jsdoc */
import Blockly from 'blockly';

const Types = Blockly.blockRendering.Types;

export default class GMBlockRenderer extends Blockly.thrasos.Renderer {
  makeRenderInfo_(block) {
    return new GMRenderInfo(this, block);
  }
}

class GMRenderInfo extends Blockly.thrasos.RenderInfo {
  /**
   * @param {Blockly.blockRendering.Row} row
   * @param {*} elem
   * @return {number}
   */
  getElemCenterline_(row, elem) {
    if (Types.isSpacer(elem)) {
      return row.yPos + elem.height / 2;
    }
    if (Types.isBottomRow(row)) {
      const bottomRow = row;
      const baseline =
          bottomRow.yPos + bottomRow.height - bottomRow.descenderHeight;
      if (Types.isNextConnection(elem)) {
        return baseline + elem.height / 2;
      }
      return baseline - elem.height / 2;
    }
    if (Types.isTopRow(row)) {
      const topRow = row;
      if (Types.isHat(elem)) {
        return topRow.capline - elem.height / 2;
      }
      return topRow.capline + elem.height / 2;
    }
    // added this
    if (!this.block_.getInputsInline() && this.block_.inputList.length > 1) {
      return row.yPos + this.constants_.TALL_INPUT_FIELD_OFFSET_Y * 2;
    }
    return row.yPos + row.height / 2;
  }
}
