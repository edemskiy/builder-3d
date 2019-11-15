import TCutout from "./TCutout";

/* global window */
const BABYLON = window.BABYLON;

class TWindow extends TCutout {
  constructor(options) {
    super(options);
    this.meshArr[0] = null;
  }
  createObject() {
    this.meshArr[0] = BABYLON.MeshBuilder.CreateBox(
      this.name,
      {
        height: this.height,
        width: this.width,
        depth: this.depth,
        updateble: true
      },
      this.scene
    );
  }
}

export default TWindow;
