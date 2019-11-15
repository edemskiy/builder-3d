/* global window */
import {
  DefaultCamera,
  DefaultGround,
  DefaultLight,
  DefaultRoom
} from "../constants/initializer";
import TRoom from "./TRoom";

const BABYLON = window.BABYLON;

class Initializer {
  constructor(engine) {
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -2, 0);

    this.scene = scene;
    this.canvas = engine.getRenderingCanvas();
  }

  createDefaultCamera() {
    const camera = new BABYLON.FreeCamera(
      DefaultCamera.name,
      new BABYLON.Vector3(
        DefaultCamera.position.x,
        DefaultCamera.position.y,
        DefaultCamera.position.z
      ),
      this.scene
    );

    camera.setTarget(
      new BABYLON.Vector3(
        DefaultCamera.target.x,
        DefaultCamera.target.y,
        DefaultCamera.target.z
      )
    );

    camera.attachControl(this.canvas);
    this.defautCamera = camera;
  }

  createDefaultGround() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      DefaultGround.name,
      {
        height: DefaultGround.height,
        width: DefaultGround.width
      },
      this.scene
    );

    const groundMaterial = new BABYLON.StandardMaterial(
      DefaultGround.materialName,
      this.scene
    );
    groundMaterial.diffuseTexture = new BABYLON.Texture(
      DefaultGround.texture.path,
      this.scene
    );
    ground.checkCollisions = true;
    groundMaterial.diffuseTexture.uScale = DefaultGround.texture.uScale;
    groundMaterial.diffuseTexture.vScale = DefaultGround.texture.vScale;
    groundMaterial.diffuseColor = new BABYLON.Color3(2, 2, 2);
    ground.material = groundMaterial;
    this.defaultGround = ground;
  }

  createDefaultRoom() {
    const room1 = new TRoom(
      DefaultRoom.height,
      DefaultRoom.width,
      DefaultRoom.depth,
      DefaultRoom.name,
      this.scene
    );

    room1.setPosition(0, 0, 0);
  }

  createDefaultLight() {
    const light = new BABYLON.HemisphericLight(
      DefaultLight.name,
      new BABYLON.Vector3(
        DefaultLight.direction.x,
        DefaultLight.direction.y,
        DefaultLight.direction.z
      ),
      this.scene
    );

    light.intensity = DefaultLight.intensity;
    this.defaultLight = light;
  }
}

export default Initializer;
