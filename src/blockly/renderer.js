/* eslint-disable require-jsdoc */
import Blockly from 'blockly';

const Types = Blockly.blockRendering.Types;

export default class GMBlockRenderer extends Blockly.thrasos.Renderer {
  makeRenderInfo_(block) {
    return new GMRenderInfo(this, block);
  }

  /**
   * Create a new instance of a renderer path object.
   *
   * @param {SVGElement} root The root SVG element.
   * @param {Blockly.Theme.BlockStyle} style The style object to use for colouring.
   * @return {Blockly.blockRendering.PathObject} The renderer path object.
   */
  makePathObject(root, style) {
    return new GMPathObject(root, style, (this.constants_));
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

class GMPathObject extends Blockly.blockRendering.PathObject {
  /**
   * Set whether the block shows a highlight or not.  Block highlighting is
   * often used to visually mark blocks currently being executed.
   *
   * @param {boolean} enable True if highlighted.
   * @internal
   */
  updateHighlighted(enable) {
    this.setClass_('gmBlocklyError', enable);
  }
}
