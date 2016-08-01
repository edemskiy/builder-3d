class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -1, 0); 
      this.scene = scene;
      
      let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(15, 5, -30), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      camera.applyGravity = true;
      this.camera = camera;

      /* Light */
      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -1), scene);
      light1.intensity = .75;

      let room1 = new TRoom(25, 40, 70, scene);
      let room2 = new TRoom(25, 50, 30, scene);
      let room3 = new TRoom(25, 30, 40, scene);

      room2.setPosition(-45, 0, -20);
      room3.setPosition(-35, 0 , 15);

      room1.getLeftWall().addDoor(10, 6, 52, scene);
      room2.getRightWall().addDoor(10, 6, 12, scene);

      room2.getFrontWall().addDoor(10, 6, 32, scene);
      room3.getBackWall().addDoor(10, 6, 12, scene);

      room1.getLeftWall().addDoor(10, 6, 5, scene);
      room3.getRightWall().addDoor(10, 6, 29,scene);

      let secFloor = new TFloor(room1.getFloor().height/3, room1.getFloor().width/4, scene);
      secFloor.setPosition(-secFloor.width*1.5, room1.getBackWall().height/4, secFloor.height);
      this.secFloor = secFloor;

      /* Stairs */
      //Params for stairs: height, width, length, stairsNum, scene
      let stairs1 = new TStairs(secFloor.getPosition().y, secFloor.width, secFloor.height/2, Math.round(secFloor.getPosition().y*1.5), this.scene);
      let stairsMaterial = new BABYLON.StandardMaterial("stairsMaterial", this.scene);
      stairsMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      stairs1.setMaterial(stairsMaterial);
      stairs1.setPosition(secFloor.getPosition().x, stairs1.stairHeight/2 + 0.25, secFloor.height/2 - stairs1.length + stairs1.stairLength/2);
      stairs1.rotateY(0);
      this.stairs1 = stairs1;

      let thirdFloor = new TFloor(room1.getFloor().height/2, room1.getFloor().width/4, scene);
      thirdFloor.setPosition(thirdFloor.width*1.5, room1.getBackWall().height*0.6, thirdFloor.height/2);
      this.thirdFloor = thirdFloor;

      let stairs2 = new TStairs(thirdFloor.getPosition().y - secFloor.getPosition().y, thirdFloor.width, 
         Math.abs(thirdFloor.getPosition().x - thirdFloor.width/2 - secFloor.getPosition().x - secFloor.width/2),
          Math.round( (thirdFloor.getPosition().y - secFloor.getPosition().y)*1.5 ), this.scene);
      stairs2.setMaterial(stairsMaterial);
      stairs2.setPosition(secFloor.getPosition().x + secFloor.width/2 + stairs2.stairLength/2, secFloor.getPosition().y + stairs2.stairHeight/2 + 0.25,
       room1.getFrontWall().getPosition().z - stairs2.width/2);
      stairs2.rotateY(Math.PI/2);
      this.stairs2 = stairs2;
   }
   getScene(){
      return this.scene;
   }
}