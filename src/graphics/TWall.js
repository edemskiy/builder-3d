import TRigid from "./TRigid";
import TWindow from "./TWindow";

// eslint-disable-next-line
const BABYLON = window.BABYLON;

class TWall extends TRigid {
  constructor(options) {
    super(options);

    this.args = options;
    const wall = BABYLON.MeshBuilder.CreateBox(
      this.name,
      {
        height: this.height,
        width: this.width,
        depth: this.depth,
        updateble: true
      },
      this.scene
    );

    wall.position.y += this.height / 2;
    wall.checkCollisions = this.collision;

    const multiMaterial = new BABYLON.StandardMaterial(
      `${this.name}Material`,
      this.scene
    );

    wall.material = multiMaterial;
    this.material = multiMaterial;

    wall.getObject = () => this;

    this.addMesh(wall);
    this.addMesh({});
    // this.CSGWall = BABYLON.CSG.FromMesh(this.getMesh());
  }

  rotateY(alpha) {
    const beta = alpha % (2 * Math.PI);
    const wallPosition = this.getPosition();
    this.getMesh().rotation.y = beta;
    this.rotation = beta;

    Object.values(this.getMesh(1)).map(mesh =>
      mesh.rotateAroundPoint(wallPosition, beta - mesh.getRotationY())
    );

    /*
    for (let key in this.getMesh(1)) {
      this.getMesh(1)[key].
      rotateAroundPoint(this.getPosition(), beta - this.getMesh(1)[key].getRotationY());
    }
    */
    // this.CSGWall.rotation.y = beta;
  }

  setMaterial(material) {
    this.getMesh().material = material;
    this.material = material;
  }

  setTexture(name) {
    this.material.diffuseTexture = new BABYLON.Texture(
      `data:name${name.length}`,
      this.scene,
      true,
      true,
      BABYLON.Texture.BILINEAR_SAMPLINGMODE,
      null,
      null,
      name,
      true
    );
  }

  setFrontTexture(name) {
    this.material.diffuseTexture = new BABYLON.Texture(
      `./textures/${name}.jpg`,
      this.scene
    );
  }

  setBackTexture(name) {
    this.material.diffuseTexture = new BABYLON.Texture(
      `./textures/${name}.jpg`,
      this.scene
    );
  }

  getAddingObjPosition(pickedPoint) {
    const currentPosition = this.getPosition();
    const c = this.width / 2;
    const alpha = -this.getRotationY();
    const wallLeftPoint = new BABYLON.Vector3(
      currentPosition.x - c * Math.cos(alpha),
      currentPosition.y,
      currentPosition.z - c * Math.sin(alpha)
    );

    const xPosition = Math.sqrt(
      (wallLeftPoint.x - pickedPoint.x) * (wallLeftPoint.x - pickedPoint.x) +
        (wallLeftPoint.z - pickedPoint.z) * (wallLeftPoint.z - pickedPoint.z)
    );

    const objPosition = new BABYLON.Vector3(
      wallLeftPoint.x + xPosition * Math.cos(alpha),
      pickedPoint.y,
      wallLeftPoint.z + xPosition * Math.sin(alpha)
    );
    return objPosition;
  }

  isFreeSpace(addingObject) {
    return Object.keys(this.meshArr[1]).every(item => {
      if (this.meshArr[1][item] === addingObject) return true;

      return !this.meshArr[1][item]
        .getMesh()
        .intersectsMesh(addingObject.getMesh());
    });
  }

  addObject(object) {
    const addingObject = object;
    const cutout = new TWindow({
      name: "window",
      height: addingObject.height,
      width: addingObject.width,
      depth: addingObject.depth,
      position: addingObject.getMesh().position,
      scene: this.scene
    });

    cutout.createObject();

    const cutoutPos = addingObject.getMesh().position;
    cutout.getMesh().position = new BABYLON.Vector3(
      cutoutPos.x,
      cutoutPos.y,
      cutoutPos.z
    );

    cutout.getMesh().rotation.y = this.rotation;

    cutout.getMesh().material = this.material;

    const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getMesh());
    const wallCSG = BABYLON.CSG.FromMesh(this.getMesh());
    wallCSG.subtractInPlace(cutoutCSG);

    cutout.getMesh().dispose();
    this.remove();

    const newMeshWall = wallCSG.toMesh(
      `${this.name}afterAdd`,
      this.material,
      this.scene
    );
    newMeshWall.rotation.y = this.rotation;

    newMeshWall.material = this.material;
    newMeshWall.checkCollisions = this.collision;
    newMeshWall.getObject = () => this;

    this.meshArr[0] = newMeshWall;
    addingObject.getMesh().name = `${this.name}:${addingObject.name}`;
    this.meshArr[1][addingObject.name] = addingObject;
    addingObject.rotateY(this.rotation);

    addingObject.getMesh().getContainingWall = () => this;
  }

  deleteObject(object, objPosition) {
    const deletingObject = object;
    const currentPosition = this.getPosition();

    const cutout = new TWindow({
      name: "window",
      height: object.height,
      width: object.width,
      depth: object.depth,
      position: object.getMesh().position,
      scene: this.scene
    });

    cutout.createObject();

    // const cutoutPos = object.getMesh().position;
    const cutoutPos = objPosition;

    cutout.getMesh().position = new BABYLON.Vector3(
      cutoutPos.x,
      cutoutPos.y,
      cutoutPos.z
    );
    cutout.getMesh().rotation.y = this.rotation;

    const solidwall = BABYLON.MeshBuilder.CreateBox(
      this.name,
      {
        height: this.height,
        width: this.width,
        depth: this.depth,
        updateble: true
      },
      this.scene
    );
    solidwall.position = currentPosition;
    solidwall.rotation.y = this.rotation;

    const solidWallCSG = BABYLON.CSG.FromMesh(solidwall);
    const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getMesh());
    const wallCSG = BABYLON.CSG.FromMesh(this.getMesh());
    let newWallCSG = wallCSG.union(cutoutCSG);

    newWallCSG = solidWallCSG.subtract(newWallCSG);
    solidWallCSG.subtractInPlace(newWallCSG);

    cutout.getMesh().dispose();
    solidwall.dispose();
    this.remove();

    const newMeshWall = solidWallCSG.toMesh(
      `${this.name}afterDelete`,
      this.material,
      this.scene
    );

    newMeshWall.checkCollisions = this.collision;
    newMeshWall.getObject = () => this;
    this.meshArr[0] = newMeshWall;

    delete this.meshArr[1][object.name];
    deletingObject.getMesh().getContainingWall = null;
  }
}

export default TWall;
