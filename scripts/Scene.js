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

      room2.setPosition(-45, 110, -20);
      room3.setPosition(-35, 110 , 15);
      
      let elementsData = [new TWindow(3, 3, 0.5, this.scene),
      new TDoor(10, 6, 0.5, this.scene)];

      let activeObjectElement = "window";

      this.addObjectObserver = this.scene.onPointerObservable.add ((evt) => {

           if(evt.pickInfo.pickedMesh === null)
               return;

           let arr = evt.pickInfo.pickedMesh.name.split(":");
           if(arr.length > 1) {
               let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];

               if (pickedWall.getMesh(0).rotation.x)
                   return;

               let currentPosition = pickedWall.getPosition();
               let pickedPoint = evt.pickInfo.pickedPoint;
               for(let i = 0; i < elementsData.length; i++){
                   if(elementsData[i].name === activeObjectElement){
                       //new TConstruct(pickedWall, currentPosition, pickedPoint, elementsData[i], "difference");
                       new TConstruct(pickedWall, currentPosition, pickedPoint, elementsData[i], "union");
                       break;
                   }
               }
           }
      }, BABYLON.PointerEventTypes.POINTERDOWN);

           
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