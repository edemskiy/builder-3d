class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0); 
      this.scene = scene;
      
      let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 5, -20), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      camera.applyGravity = true;
      this.camera = camera;

      /* Свет */
      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -1), scene);
      light1.intensity = .75;

      let room1 = new TRoom(25, 40, 70, scene);
      let room2 = new TRoom(25, 50, 30, scene);
      room2.setPosition(-45, 0, -20);
      room1.getLeftWall().addDoor(10, 7, 50, scene);
      room2.getRightWall().addDoor(10, 7, 13, scene);

      let secFloor = new TFloor(room1.getFloor().height/3, room1.getFloor().width/4, scene);
      secFloor.setPosition(-secFloor.width*1.5, room1.getBackWall().height/4, secFloor.height);
      this.secFloor = secFloor;

      /* Лестница */
      //Params for stairs: height, width, length, stairsNum, scene
      let stairs1 = new TStairs(secFloor.getPosition().y, secFloor.width, secFloor.height/2, 15, this.scene);
      let stairsMaterial = new BABYLON.StandardMaterial("stairsMaterial", this.scene);
      stairsMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.8, 0.7);
      stairs1.setMaterial(stairsMaterial);
      stairs1.setPosition(secFloor.getPosition().x, stairs1.stairHeight/2, secFloor.height/2 - stairs1.length + stairs1.stairLength/2);
      stairs1.rotateY(0);
      this.stairs1 = stairs1;

      let thirdFloor = new TFloor(room1.getFloor().height/2, room1.getFloor().width/4, scene);
      thirdFloor.setPosition(thirdFloor.width*1.5, room1.getBackWall().height*0.6, thirdFloor.height/2);
      this.thirdFloor = thirdFloor;

      let stairs2 = new TStairs(thirdFloor.getPosition().y - secFloor.getPosition().y, thirdFloor.width, 
         Math.abs(thirdFloor.getPosition().x - thirdFloor.width/2 - secFloor.getPosition().x - secFloor.width/2), 15, this.scene);
      stairs2.setMaterial(stairsMaterial);
      stairs2.setPosition(secFloor.getPosition().x + secFloor.width/2 + stairs2.stairLength/2, secFloor.getPosition().y + stairs2.stairHeight/2,
       room1.getFrontWall().getPosition().z - stairs2.width/2);
      stairs2.rotateY(Math.PI/2);
      this.stairs2 = stairs2;
   }
   getScene(){
      return this.scene;
   }
}