class Scene {
   constructor (engine) {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);
      this.scene = scene;      
    }

    createScene() {
      const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, -80), this.scene);
      //const camera = new BABYLON.ArcRotateCamera('RotateCamera', 3 * Math.PI/2, Math.PI/8, 100, BABYLON.Vector3.Zero(),this.scene);
      //camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      //camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      //camera.applyGravity = true;
      this.camera = camera;

      const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
      light1.intensity = .75;

      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 5000, height: 5000 }, this.scene);
      const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture('textures/groundTexture.png', this.scene);
      ground.checkCollisions = true;
      groundMaterial.diffuseTexture.uScale = 350;
      groundMaterial.diffuseTexture.vScale = 350;
      groundMaterial.diffuseColor = new BABYLON.Color3(2,2,2);
      ground.material = groundMaterial;

      /* Infinite Cube */
      /*
      let skybox = BABYLON.Mesh.CreateBox('skyBox', 400.0, this.scene);
      let skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;
      skybox.infiniteDistance = true;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/skybox/skybox', this.scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      */


      const room1 = new TRoom(25, 50, 50, 'room1');

      this.roomsArr = {
       room1
      };

      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint, currentMeshObj, currentMesh, intersectedMesh, beginPosition = {};

      const getGroundPosition = () => {
        let pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh == ground) );
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }
        return null;
      }

      this.addObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        if (evt.pickInfo.pickedMesh === null)
          return;
        
        if (evt.pickInfo.pickedMesh.name.split(':')[2] && evt.pickInfo.pickedMesh.name.split(':')[2].indexOf('window') !== -1){
          const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh !== ground) );
          if (pickInfo.hit) {
            const arr = evt.pickInfo.pickedMesh.name.split(':');
            currentMeshObj = this.roomsArr[arr[0]].getMesh(0)[arr[1]].getMesh(1)[arr[2]];
            currentMesh = currentMeshObj.getObject();

            for (let key in currentMesh.position) {
              beginPosition[key] = currentMesh.position[key];
            }

            startingPoint = getGroundPosition(evt);
            if (startingPoint){
              setTimeout( () => {
                camera.detachControl(map.engine.getRenderingCanvas());
              }, 0);
            }
            const pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
            pickedWall.deleteObject(currentMeshObj);
          }
          return;
        }

        const arr = evt.pickInfo.pickedMesh.name.split(':');
        if (arr.length > 1) {
          let pickedWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];

          if (pickedWall.getClassName() !== 'TWall')
            return;

          const pickedPoint = evt.pickInfo.pickedPoint;

          const { objPosition, xPosition } = pickedWall.getDistanceFromLeft(pickedPoint); 

          elementsData.map((item) => {
            if(item === activeObjectElement) {
              new TConstruct(pickedWall, activeObjectElement, {name: 'window', height: 8, width: 8, depth: 0.5, position: objPosition, xPosition: xPosition});
            }
          });
        }
      }, BABYLON.PointerEventTypes.POINTERDOWN);      
      
      this.moveObjectObserver = this.scene.onPointerObservable.add ((evt) => {
        if (!startingPoint) return;

        const current = getGroundPosition(evt);
        if (!current) return;

        const diff = current.subtract(startingPoint);
        //currentMesh.position.addInPlace(diff);
        
        currentMesh.position.x += diff.x;
        //currentMesh.position.y += diff.y;
        currentMesh.position.z += diff.z;
        
        this.scene.meshes.map((item) => {
          if (currentMesh.intersectsMesh(item) && currentMesh !== item) {
            const arr = item.name.split(':');
            if (arr.length > 1) {
              intersectedMesh = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
              if (intersectedMesh.getClassName() === 'TWall'){
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

          for(let i = 0; i < this.scene.meshes.length; i++) {
            if (currentMesh.intersectsMesh(this.scene.meshes[i]) && currentMesh !== this.scene.meshes[i]){
              isIntersect = true;
              const arr = this.scene.meshes[i].name.split(':');

              if (arr.length > 1) {
                intersectedMesh = this.roomsArr[arr[0]].getMesh(0)[arr[1]];
                if (intersectedMesh.getClassName() === 'TWall'){
                  currentMeshObj.getObject().rotation.y = intersectedMesh.getMesh(0).rotation.y;
                  
                  const pickedPoint = currentMesh.position;
                  const { objPosition, xPosition } = intersectedMesh.getDistanceFromLeft(pickedPoint); 

                  currentMesh.position = objPosition;
                  const prevWallNameArr = currentMesh.name.split(':');
                  const prevWall = this.roomsArr[prevWallNameArr[0]].getMesh(0)[prevWallNameArr[1]];

                  if (intersectedMesh.isFreeSpace(currentMeshObj, xPosition, objPosition.y)) {
                    delete prevWall.getMesh(1)[currentMeshObj.name];
                    intersectedMesh.addObject(currentMeshObj, xPosition, objPosition.y);
                    
                  }
                  else{
                    isIntersect = false;
                  }
                }
              }
              break;
            }
          }

          if (!isIntersect) {
            for (let key in beginPosition) {
              currentMesh.position[key] = beginPosition[key];
            }

            const arr = currentMesh.name.split(':');
            const initialWall = this.roomsArr[arr[0]].getMesh(0)[arr[1]];

            const { xPosition } = initialWall.getDistanceFromLeft(currentMesh.position); 
            
            initialWall.addObject(currentMeshObj, xPosition, currentMesh.position.y);

          }
          camera.attachControl(map.engine.getRenderingCanvas(), true);
          startingPoint = null;
          return;
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
      
    }

    getScene() {
      return this.scene;
    }
}