/**
 * An intrinsic object that provides vector mathematics functionality.
 *
 * Vectors are represented by arrays of numbers. Example: [5, 2] is a 2d vector pointing at x: 5, y: 2.
 */
interface APIVector {
  /**
   * Adds the components of vector B to the respective components of vector A.
   *
   * B can also be a number, in which case B is added to every single component of A.
   *
   * @memberof Vector
   */
  add: (a: number[], b: number | number[]) => number[];
  /**
   * Subtracts the components of vector B from the respective components of vector A.
   *
   * B can also be a number, in which case B is subtracted from every single component of A.
   *
   * @memberof Vector
   */
  subtract: (a: number[], b: number | number[]) => number[];
  /**
   * Multiplies the components of vector A by the respective components of vector B.
   *
   * B can also be a number, in which case, every single component of A is multiplied by B.
   *
   * @memberof Vector
   */
  multiply: (a: number[], b: number | number[]) => number[];
  /**
   * Divides the components of vector A by the respective components of vector B.
   *
   * B can also be a number, in which case, every single component of A is divided by B.
   *
   * @memberof Vector
   */
  divide: (a: number[], b: number | number[]) => number[];
  /**
   * Returns the length (also called magnitude) of the vector.
   *
   * @memberof Vector
   */
  length: (vector: number[]) => number;
  /**
   * Returns the distance between vector A and vector B.
   *
   * @memberof Vector
   */
  distance: (a: number[], b: number[]) => number;
  /**
   * Returns the vector scaled to have a length of 1.
   *
   * @memberof Vector
   */
  normalize: (vector: number[]) => number[];
  /**
   * Returns the dot product of vector A and vector B.
   *
   * If normalized vectors are given, the returns 1 if they point in exactly the same direction,
   * -1 if they point in completely opposite directions and zero if the vectors are perpendicular.
   *
   * @memberof Vector
   */
  dot: (a: number[], b: number[]) => number;
  /**
   * Reflects a vector (dir) off the plane defined by a normal.
   *
   * The `normal` vector defines a plane (a plane's normal is the vector that is perpendicular to its surface).
   * The `dir` vector is treated as a directional arrow coming in to the plane.
   * The returned value is a vector of equal magnitude to `dir` but with its direction reflected.
   *
   * @memberof Vector
   */
  reflect: (dir: number[], normal: number[]) => number[];
  /**
   * Returns a vector linearly interpolated between vectors A and B by the interpolant t.
   *
   * When t = 0, vector A is returned.
   *
   * When t = 1, vector B is returned.
   *
   * When t = 0.5, the vector midway between A and B is returned.
   *
   * @memberof Vector
   */
  lerp: (a: number[], b: number[], t: number) => number[];
  /**
   * Rotate a 2d vector by a given angle, taking the point zero (0, 0) as the rotation center.
   *
   * @memberof Vector
   */
  rotate2d: (v: vector2d, a: number) => vector2d;
  /**
   * Get the angle between the 2d vector and (1, 0), taking the point zero (0, 0) as the rotation center.
   *
   * This is the inverse of `Vector.rotate2d([1, 0], angle)`.
   *
   * @memberof Vector
   */
  getAngle2d: (v: vector2d) => number;
}

declare type vector2d = [number, number];
