export interface APIWorldCapZone {
  /**
   * Capture zone type.
   *
   * - Type 1 is a normal capzone,
   * - Type 2 is Instant Red Win,
   * - Type 3 is Instant Blue Win,
   * - Type 4 is Instant Green Win,
   * - Type 5 is Instant Yellow Win.
   */
  type: 'normal' | 'redWin' | 'blueWin' | 'greenWin' | 'yellowWin';
  /**
   * Capture completion, or progress.
   *
   * It increases when only the owner/s are inside the capture zone,
   * decreases when an opponent is inside, and stays still if none or both
   * of them are inside.
   */
  progress: number;
  /**
   * Capture zone length, the value that `progress` must reach to completely capture the zone.
   */
  length: number;
  /**
   * ID of the capture zone's shape.
   */
  shapeId: number;
  /**
   * ID of the owner, or leading player of the capture zone.
   * If no one has entered it yet, this will be -1. When on teams, `leadingTeam` is used instead.
   */
  leadingPlayerId: number;
  /**
   * Owner, or leading team of the capture zone.
   *
   * - When `ot == -1`, no team is owner yet.
   * - When `ot == 2`, Red Team is owner.
   * - When `ot == 3`, Blue Team is owner.
   * - When `ot == 4`, Green Team is owner.
   * - When `ot == 5`, Yellow Team is owner.
   */
  leadingTeam: number;
}
