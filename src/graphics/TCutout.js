import TRigid from "./TRigid";
// eslint-disable-next-line
const BABYLON = window.BABYLON;

class TCutout extends TRigid {
  constructor(options) {
    super(options);
    this.name = options.name;
    this.height = options.height;
    this.width = options.width;
    this.depth = options.depth;

    this.position = new BABYLON.Vector3(
      options.position.x,
      options.position.y,
      options.position.z
    );
  }
}

export default TCutout;
