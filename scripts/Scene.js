class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);
      this.scene = scene;
      
      let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(15, 5, -20), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      camera.applyGravity = true;
      this.camera = camera;

      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -1), this.scene);
      light1.intensity = .75;

      let room1 = new TRoom(25, 40, 70, "room1", this.scene);
      let room2 = new TRoom(25, 50, 30, "room2", this.scene);
      let room3 = new TRoom(25, 30, 40, "room3", this.scene);

      this.roomsArr = {
         "room1" : room1,
         "room2" : room2,
         "room3" : room3
      };

      room2.setPosition(-45, 0, -20);
      room3.setPosition(-35, 0 , 15);
      
      room1.getLeftWall().addDoor(10, 6, 10, this.scene);
      room2.getRightWall().remove();

      room2.getFrontWall().addDoor(10, 6, 32, this.scene);
      room3.getBackWall().remove();

      room1.getLeftWall().addDoor(10, 6, 50, this.scene);
      room3.getRightWall().remove();

      let constrAddWindow = new TConstruct("window", this, {height: 4, width: 4});
      //let constrAddDoor = new TConstruct("door", {height: 10, width: 6},this);

      
      //---------------------------------------------------------------------------------------
      // let secFloor = new TFloor(room1.getFloor().height/3, room1.getFloor().width/4, "secFloor", this.scene);
      // secFloor.setPosition(-secFloor.width*1.5, room1.getBackWall().height/4, secFloor.height);
      // this.secFloor = secFloor;

      // //Params for stairs: height, width, length, stairsNum, scene
      // let stairs1 = new TStairs(secFloor.getPosition().y, secFloor.width, secFloor.height/2, Math.round(secFloor.getPosition().y*1.5), this.scene);
      // stairs1.setPosition(secFloor.getPosition().x, stairs1.stairHeight/2 + 0.25, secFloor.height/2 - stairs1.length + stairs1.stairLength/2);
      // stairs1.rotateY(0);

      // let stairsMaterial = new BABYLON.StandardMaterial("stairsMaterial", this.scene);
      // stairsMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      // stairs1.setMaterial(stairsMaterial);
      
      // this.stairs1 = stairs1;

      // let thirdFloor = new TFloor(room1.getFloor().height/2, room1.getFloor().width/4, "thirdFloor", this.scene);
      // thirdFloor.setPosition(thirdFloor.width*1.5, room1.getBackWall().height*0.6, thirdFloor.height/2);
      // this.thirdFloor = thirdFloor;

      // let stairs2 = new TStairs(thirdFloor.getPosition().y - secFloor.getPosition().y, thirdFloor.width, 
      //    Math.abs(thirdFloor.getPosition().x - thirdFloor.width/2 - secFloor.getPosition().x - secFloor.width/2),
      //    Math.round( (thirdFloor.getPosition().y - secFloor.getPosition().y)*1.5 ), this.scene);

      // stairs2.setPosition(secFloor.getPosition().x + secFloor.width/2 + stairs2.stairLength/2, secFloor.getPosition().y + stairs2.stairHeight/2 + 0.25,
      //     room1.getFrontWall().getPosition().z - stairs2.width/2);
      
      // stairs2.rotateY(Math.PI/2);
      // stairs2.setMaterial(stairsMaterial);
      // this.stairs2 = stairs2;

      //---------------------------------------------------------------------------------------

      // this.scene.onPointerObservable.add ((evt) => {
      //    let myObjMesh = scene.pick(scene.pointerX, scene.pointerY);
      //    let arr = myObjMesh.pickedMesh.name.split(":");

      //    if(arr.length > 1){
      //       let wall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
      //       let currPos = wall.getPosition();
      //       let point = myObjMesh.pickedPoint;      
      //    }
      // }, BABYLON.PointerEventTypes.POINTERMOVE);

      //---------------------------------------------------------------------------------------

      // let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
      // wallMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.85, 1);
      // let wall = BABYLON.MeshBuilder.CreateBox("wall", {height: 12, width: 12, depth: 0.5}, this.scene);
      // let window = BABYLON.MeshBuilder.CreateBox("window", {height: 4, width: 4, depth: 0.5}, this.scene);
      // wall.rotation.y += 0.5;
      // window.rotation.y += 0.5;
      // let windowCSG = BABYLON.CSG.FromMesh(window);
      // let wallCSG = BABYLON.CSG.FromMesh(wall);
      // let newWall = wallCSG.subtract(windowCSG);
      // wall.dispose();
      // window.dispose();
      // let newMeshWall = newWall.toMesh("name", this.mat, this.scene);   
      }
      getScene(){
      return this.scene;
      }
}