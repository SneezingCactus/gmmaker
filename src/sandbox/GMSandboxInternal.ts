import type GMSandboxExternal from './GMSandboxExternal';

export default class GMSandboxInternal {
  public compartment: Compartment;

  constructor(_external: GMSandboxExternal) {
    this.compartment = new Compartment();
  }
}
