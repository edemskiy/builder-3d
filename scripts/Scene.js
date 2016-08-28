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
      //let constrAddDoor = new TConstruct("door", this, {height: 10, width: 6});

      
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
      }
      getScene(){
      return this.scene;
      }
}