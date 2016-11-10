class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);

      this.scene = scene;
      
    }
    createScene(){
      //let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 60, -80), this.scene);
      let camera = new BABYLON.ArcRotateCamera("RotateCamera", 3 * Math.PI/2, Math.PI/8, 100, BABYLON.Vector3.Zero(),this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      //camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      //camera.applyGravity = true;
      this.camera = camera;

      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
      light1.intensity = .75;

      var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 5000, height: 5000}, this.scene);
      let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture("textures/groundTexture.png", this.scene);
      ground.checkCollisions = true;
      groundMaterial.diffuseTexture.uScale = 350;
      groundMaterial.diffuseTexture.vScale = 350;
      groundMaterial.diffuseColor = new BABYLON.Color3(2,2,2);
      ground.material = groundMaterial;


      // let skybox = BABYLON.Mesh.CreateBox("skyBox", 400.0, this.scene);
      // let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
      // skyboxMaterial.backFaceCulling = false;
      // skyboxMaterial.disableLighting = true;
      // skybox.material = skyboxMaterial;
      // skybox.infiniteDistance = true;
      // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", this.scene);
      // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

      let room1 = new TRoom(25, 50, 50, "room1");

      this.roomsArr = {
       "room1" : room1
      };

      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint, currentMeshObj, currentMesh, intersectedMesh, beginPosition = {};

      let getGroundPosition = () => {
        let pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => mesh == ground);
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }
        return null;
      }

      this.addObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        
        if(evt.pickInfo.pickedMesh.name.split(":")[2] && evt.pickInfo.pickedMesh.name.split(":")[2].indexOf("window") !== -1){
          var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => mesh !== ground);
          if (pickInfo.hit) {
            let arr = evt.pickInfo.pickedMesh.name.split(":");
            currentMeshObj = this.roomsArr[arr[0]].getMesh(0)[arr[1]].getMesh(1)[arr[2]];
            currentMesh = currentMeshObj.getObject();

            for (let key in currentMesh.position) {
              beginPosition[key] = currentMesh.position[key];
            }

            startingPoint = getGroundPosition(evt);
            if(startingPoint){
              setTimeout(function () {
                camera.detachControl(map.engine.getRenderingCanvas());
              }, 0);
            }
            let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
            pickedWall.deleteObject(currentMeshObj);
          }
          return;
        }
        

        if(evt.pickInfo.pickedMesh === null)
          return;

        let arr = evt.pickInfo.pickedMesh.name.split(":");
        if(arr.length > 1) {
          let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];

          if (pickedWall.getClassName() !== "TWall")
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
              new TConstruct(pickedWall, activeObjectElement, {name: "window", height: 6, width: 6, depth: 0.5, position: objPosition, xPosition: xPosition});
            }
          });
        }
      }, BABYLON.PointerEventTypes.POINTERDOWN);
      
      
      this.moveObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        if (!startingPoint) {
          return;
        }
        let current = getGroundPosition(evt);
        if(!current) return;
        let diff = current.subtract(startingPoint);
        //currentMesh.position.addInPlace(diff);
        currentMesh.position.x += diff.x;
        //currentMesh.position.y += diff.y;
        currentMesh.position.z += diff.z;
        this.scene.meshes.map((item) => {
          if(currentMesh.intersectsMesh(item)){
            if (currentMesh === item) return;
            let arr = item.name.split(":");
            if(arr.length > 1) {
              intersectedMesh = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
              if (intersectedMesh.getClassName() === "TWall"){
                currentMesh.rotation.y = intersectedMesh.getMesh(0).rotation.y;
              }
            }
          }
        });

        startingPoint = current;

      }, BABYLON.PointerEventTypes.POINTERMOVE);

      this.pointerUpObserver = this.scene.onPointerObservable.add ((evt) => {
        if (startingPoint) {

          let isIntersect = false;

          this.scene.meshes.map((item) => {
            if(currentMesh.intersectsMesh(item)){
              
              if (currentMesh === item) return;

              isIntersect = true;

              let arr = item.name.split(":");
              if(arr.length > 1) {
                intersectedMesh = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
                if (intersectedMesh.getClassName() === "TWall"){

                  currentMeshObj.getObject().rotation.y = intersectedMesh.getMesh(0).rotation.y;
                  
                  let pickedPoint = currentMesh.position;
                  let currentPosition = intersectedMesh.getPosition();

                  let c = intersectedMesh.width/2;
                  let alpha = -intersectedMesh.getRotationY();
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
                  currentMesh.position = objPosition;
                  intersectedMesh.addObject(currentMeshObj, xPosition, objPosition.y);
                }
              }
            }
          });
          if(!isIntersect){
            for (let key in beginPosition) {
              currentMesh.position[key] = beginPosition[key];
            }

            let arr = currentMesh.name.split(":");
            let initialWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];

            let c = initialWall.width/2;
            let alpha = -initialWall.getRotationY();
            
            let currentPosition = initialWall.getPosition();
            
            let wallLeftPoint = {
              x: currentPosition.x - c * Math.cos(alpha),
              y: currentPosition.y,
              z: currentPosition.z - c * Math.sin(alpha)
            }

            let xPosition = Math.sqrt((wallLeftPoint.x - currentMesh.position.x)*(wallLeftPoint.x - currentMesh.position.x) +
              (wallLeftPoint.z - currentMesh.position.z)*(wallLeftPoint.z - currentMesh.position.z));
            
            initialWall.addObject(currentMeshObj, xPosition, currentMesh.position.y);

          }
          camera.attachControl(map.engine.getRenderingCanvas(), true);
          startingPoint = null;
          return;
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
      
    }
    getScene(){
      return this.scene;
    }
}