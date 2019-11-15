export const DefaultCamera = {
  name: "default:camera",
  position: { x: 0, y: 60, z: -80 },
  target: { x: 0, y: 0, z: 0 }
};

export const DefaultGround = {
  name: "default:ground",
  height: 5000,
  width: 5000,
  materialName: "default:ground:material",
  texture: {
    path: "./textures/groundTexture.png",
    uScale: 350,
    vScale: 350
  }
};

export const DefaultLight = {
  name: "default:light",
  direction: { x: 0, y: 1, z: 0 },
  intensity: 0.75
};

export const DefaultRoom = {
  height: 20,
  width: 50,
  depth: 50,
  name: "default:room"
};
