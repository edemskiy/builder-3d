/* global window */
import TWall from "./TWall";
import TFloor from "./TFloor";

const BABYLON = window.BABYLON;

class TRoom {
  constructor(height, width, length, name, scene) {
    // super(scene);
    this.name = name;
    const depth = 0.5;

    const floor = new TFloor({
      height: length,
      width,
      depth,
      name: `${name}:floor`,
      scene
    });

    floor.material.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
    this.floor = floor;

    const backWall = new TWall({
      height,
      width: floor.width,
      depth,
      name: `${name}:backWall`,
      scene
    });
    backWall.rotateY(Math.PI);
    this.backWall = backWall;

    const frontWall = new TWall({
      height,
      width: floor.width,
      depth,
      name: `${name}:frontWall`,
      scene
    });
    this.frontWall = frontWall;

    const rightWall = new TWall({
      height: backWall.height,
      width: floor.height,
      depth,
      name: `${name}:rightWall`,
      scene
    });

    rightWall.rotateY(Math.PI / 2);
    this.rightWall = rightWall;

    const leftWall = new TWall({
      height: backWall.height,
      width: floor.height,
      depth,
      name: `${name}:leftWall`,
      scene
    });
    leftWall.rotateY(-Math.PI / 2);
    this.leftWall = leftWall;
    // let ceiling = new TCeiling(floor.height, floor.width, depth, name + ':ceiling');
    // this.ceiling = ceiling;

    this.setPosition(0, 0, 0);
    this.setWallsFrontTexture("brickTexture");
    this.setWallsBackTexture("brickTexture");

    /*
    this.meshArr[0] = {
       floor,
       frontWall,
       rightWall,
       backWall,
       leftWall,
       //'ceiling': this.ceiling
    };
    */
  }

  setPosition(x, y, z) {
    this.floor.setPosition(x, y, z);

    this.backWall.setPosition(
      this.floor.getPosition().x,
      this.floor.getPosition().y + this.backWall.height / 2,
      this.floor.getPosition().z - this.floor.height / 2
    );

    this.frontWall.setPosition(
      this.floor.getPosition().x,
      this.floor.getPosition().y + this.frontWall.height / 2,
      this.floor.getPosition().z + this.floor.height / 2
    );

    this.rightWall.setPosition(
      this.floor.getPosition().x + this.floor.width / 2,
      this.floor.getPosition().y + this.backWall.height / 2,
      this.backWall.getPosition().z + this.rightWall.width / 2
    );

    this.leftWall.setPosition(
      this.floor.getPosition().x - this.floor.width / 2,
      this.floor.getPosition().y + this.backWall.height / 2,
      this.backWall.getPosition().z + this.leftWall.width / 2
    );

    /*
    this.ceiling.setPosition(
      this.floor.getPosition().x,
      this.floor.getPosition().y + this.backWall.height,
      this.floor.getPosition().z,
    );
    */
  }

  setWallsFrontTexture(name) {
    this.leftWall.setFrontTexture(name);
    this.rightWall.setFrontTexture(name);
    this.frontWall.setFrontTexture(name);
    this.backWall.setFrontTexture(name);
  }

  setWallsBackTexture(name) {
    this.leftWall.setBackTexture(name);
    this.rightWall.setBackTexture(name);
    this.frontWall.setBackTexture(name);
    this.backWall.setBackTexture(name);
  }

  getFloor() {
    return this.floor;
  }

  getCeiling() {
    return this.ceiling;
  }

  getLeftWall() {
    return this.leftWall;
  }

  getRightWall() {
    return this.rightWall;
  }

  getFrontWall() {
    return this.frontWall;
  }

  getBackWall() {
    return this.backWall;
  }

  getName() {
    return this.name;
  }
}

export default TRoom;
