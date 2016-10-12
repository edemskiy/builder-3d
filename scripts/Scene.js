class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);
      this.scene = scene;
    }
    createScene(){
      let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(15, 5, -20), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      camera.applyGravity = true;
      this.camera = camera;

      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -1), this.scene);
      light1.intensity = .75;

      let room1 = new TRoom(25, 40, 70, "room1");
      let room2 = new TRoom(25, 50, 30, "room2");
      let room3 = new TRoom(25, 30, 40, "room3");

      this.roomsArr = {
       "room1" : room1,
       "room2" : room2,
       "room3" : room3
      };

      room2.setPosition(-45, 50, -20);
      room3.setPosition(-35, 50, 15);

      let elementsData = [TWindow, TDoor];
      console.log(elementsData);

      let activeObjectElement = TWindow;

      this.addObjectObserver = this.scene.onPointerObservable.add ((evt) => {

        if(evt.pickInfo.pickedMesh === null)
          return;

        let arr = evt.pickInfo.pickedMesh.name.split(":");
        if(arr.length > 1) {
          let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
            
          if (pickedWall.getMesh(0).rotation.x)
            return;
            
          let pickedPoint = evt.pickInfo.pickedPoint;
          let currentPosition = pickedWall.getPosition();

          let objPosition = {
            x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
            y: currentPosition.y - pickedWall.height/2 + Math.floor(pickedPoint.y),
            z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
          };

          for(let i = 0; i < elementsData.length; i++){
            if(elementsData[i] === activeObjectElement){
              new TConstruct(pickedWall, activeObjectElement, {height: 4, width: 4, depth: 0.5, position: objPosition});
              break;
            }
          }
        }
      }, BABYLON.PointerEventTypes.POINTERDOWN);
    }
    getScene(){
      return this.scene;
    }
}