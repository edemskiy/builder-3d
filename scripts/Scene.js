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
      //let room2 = new TRoom(25, 50, 30, "room2");
      //let room3 = new TRoom(25, 30, 40, "room3");

      this.roomsArr = {
       "room1" : room1
       //"room2" : room2,
       //"room3" : room3
      };

      //room2.setPosition(-45, 50, -20);
      //room3.setPosition(-35, 50, 15);

      console.dir(room1.__proto__.constructor === TRoom);


      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint;
      let currentMesh;

      this.addObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        /*
        if (evt.pickInfo.pickedMesh.name === "window"){
          currentMesh = evt.pickInfo.pickedMesh;
          startingPoint = evt.pickInfo.pickedPoint;
          setTimeout(function () {
                    camera.detachControl(map.engine.getRenderingCanvas());
                }, 0);
          return;
        }
        */

        if(evt.pickInfo.pickedMesh === null)
          return;

        let arr = evt.pickInfo.pickedMesh.name.split(":");
        if(arr.length > 1) {
          let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
            
          if (!pickedWall.__proto__.constructor === TWall)
            return;
          let pickedPoint = evt.pickInfo.pickedPoint;
          let currentPosition = pickedWall.getPosition();

          let c = pickedWall.width/2;
          let alpha = -pickedWall.getRotationY();
          let wallLeftPoint = {
            x: currentPosition.x - c * Math.cos(alpha),
            y: currentPosition.y,
            z: currentPosition.z - c * Math.sin(alpha)
          }

          let xPosition = Math.sqrt((wallLeftPoint.x - pickedPoint.x)*(wallLeftPoint.x - pickedPoint.x) +
            (wallLeftPoint.z - pickedPoint.z)*(wallLeftPoint.z - pickedPoint.z));

          let objPosition = {
            x: wallLeftPoint.x + xPosition * Math.cos(alpha),
            y: pickedPoint.y,
            z: wallLeftPoint.z + xPosition * Math.sin(alpha)
          };

          elementsData.map((item) => {
            if(item === activeObjectElement){
              new TConstruct(pickedWall, activeObjectElement, {name: "window", height: 4, width: 4, depth: 0.5, position: objPosition, xPosition: xPosition});
            }
          });
        }
      }, BABYLON.PointerEventTypes.POINTERDOWN);
      
      /*
      this.moveObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        if (!startingPoint) {
          return;
        }
        let current = evt.pickInfo.pickedPoint;
        let diff = current.subtract(startingPoint)
        currentMesh.position.addInPlace(diff);
        startingPoint = current;

      }, BABYLON.PointerEventTypes.POINTERMOVE);

      this.pointerUpObserver = this.scene.onPointerObservable.add ((evt) => {
        if (startingPoint) {
            camera.attachControl(map.engine.getRenderingCanvas(), true);
            startingPoint = null;
            return;
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
      */
    }
    getScene(){
      return this.scene;
    }
}