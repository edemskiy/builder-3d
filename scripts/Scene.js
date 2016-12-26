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
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      //camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      //camera.checkCollisions = true;
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

      const room1 = new TRoom(25, 50, 50, 'room1');

      this.roomsArr = {
       room1
      };
      
      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint, currentMeshObj, currentMesh, intersectedMesh, beginPosition, DestinationPoint;

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

        if (!evt.pickInfo.pickedMesh.showBoundingBox)
            return;
        
        if (evt.pickInfo.pickedMesh.name.includes("window")){
          
          const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh !== ground) );
          if (pickInfo.hit) {
            const arr = evt.pickInfo.pickedMesh.name.split(':');
            currentMeshObj = this.roomsArr[arr[0]].getMesh()[arr[1]].getMesh(1)[arr[2]];
            currentMesh = currentMeshObj.getMesh();

            beginPosition = new BABYLON.Vector3(currentMesh.position.x, currentMesh.position.y, currentMesh.position.z);
            startingPoint = getGroundPosition(evt);
            
            if (startingPoint){
              setTimeout( () => {
                camera.detachControl(map.engine.getRenderingCanvas());
              }, 0);
            }
            const pickedWall = this.roomsArr[arr[0]].getMesh()[arr[1]];
            pickedWall.deleteObject(currentMeshObj);
          }
          return;
        }

        const arr = evt.pickInfo.pickedMesh.name.split(':');
        if (arr.length > 1) {
          let pickedWall = this.roomsArr[arr[0]].getMesh()[arr[1]];

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

        if(currentMesh.name.includes("Wall")){
          const arr = currentMesh.name.split(':');
          if (arr.length > 2) {
            const containingWall = this.roomsArr[arr[0]].getMesh()[arr[1]];
            const alpha = -containingWall.getRotationY();
            
            if(alpha % Math.PI === 0){
              currentMesh.position.x += diff.x;
              startingPoint = current;
              return;
            }

            if(Math.abs(alpha) === Math.PI/2){
              currentMesh.position.z += diff.z;
              startingPoint = current;
              return;
            }

            const x1 = currentMesh.position.x + diff.x, z1 = currentMesh.position.z + diff.z, x0 = currentMesh.position.x, z0 = currentMesh.position.z;
            const x = (Math.tan(alpha) * (z1 - z0 + x0 * Math.tan(alpha)) + x1) / (Math.tan(alpha) ** 2 + 1);
            const z = (Math.tan(alpha) * x + z0 - Math.tan(alpha)*x0);

            currentMesh.position.x = x;
            currentMesh.position.z = z;
          }
        }
        startingPoint = current;
      }, BABYLON.PointerEventTypes.POINTERMOVE);

      this.pointerUpObserver = this.scene.onPointerObservable.add ((evt) => {
        if (startingPoint) {
          let isIntersect = false;

          for(let i = 0; i < this.scene.meshes.length; i++) {
            if (currentMesh.intersectsMesh(this.scene.meshes[i], true) && currentMesh !== this.scene.meshes[i]){
              isIntersect = true;
              const arr = this.scene.meshes[i].name.split(':');

              if (arr.length > 1) {
                intersectedMesh = this.roomsArr[arr[0]].getMesh()[arr[1]];
                if (intersectedMesh.getClassName() === 'TWall'){
                  currentMeshObj.getMesh().rotation.y = intersectedMesh.getMesh().rotation.y;
                  
                  const pickedPoint = currentMesh.position;
                  const { objPosition, xPosition } = intersectedMesh.getDistanceFromLeft(pickedPoint); 

                  currentMesh.position = objPosition;
                  const prevWallNameArr = currentMesh.name.split(':');
                  const prevWall = this.roomsArr[prevWallNameArr[0]].getMesh()[prevWallNameArr[1]];

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

            currentMesh.position = new BABYLON.Vector3(beginPosition.x, beginPosition.y, beginPosition.z)

            const arr = currentMesh.name.split(':');
            const initialWall = this.roomsArr[arr[0]].getMesh()[arr[1]];

            const { xPosition } = initialWall.getDistanceFromLeft(currentMesh.position); 
            
            initialWall.addObject(currentMeshObj, xPosition, currentMesh.position.y);
          }
          camera.attachControl(map.engine.getRenderingCanvas(), true);
          startingPoint = null;
          return;
        }
        else{
          this.scene.meshes.map((item) => {
            item.showBoundingBox = false;
          });
            evt.pickInfo.pickedMesh.showBoundingBox = true;
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
    }

    getScene() {
      return this.scene;
    }
}