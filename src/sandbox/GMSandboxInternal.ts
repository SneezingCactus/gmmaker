import defineApiMath from './api/math';
import defineApiVector from './api/vector';
import type GMSandboxExternal from './GMSandboxExternal';

export default class GMSandboxInternal {
  public compartment: Compartment;

  constructor(_external: GMSandboxExternal) {
    const gmMath = defineApiMath();
    const gmVector = defineApiVector(gmMath);

    this.compartment = new Compartment({
      Math: gmMath,
      Vector: gmVector,
    });
  }
}
