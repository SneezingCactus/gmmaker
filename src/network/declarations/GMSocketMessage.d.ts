export enum GMSocketMessageType {
  ApplyMode,
  ClearMode,
}

export interface GMSocketClearModeMessage extends GMSocketMessageBase {
  gmmaker: true;
  type: GMSocketMessageType.ClearMode;
}

export interface GMSocketApplyModeMessage extends GMSocketMessageBase {
  gmmaker: true;
  type: GMSocketMessageType.ApplyMode;
  newMode: ArrayBuffer;
}

export interface GMSocketMessageBase {
  gmmaker: true;
  type: GMSocketMessageType;
}

export type GMSocketMessage = GMSocketApplyModeMessage | GMSocketClearModeMessage;
