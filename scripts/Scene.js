class Scene {
   constructor (engine) {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);
      this.scene = scene;      
    }

    createScene() {
      let pickObj = document.getElementById("pickObjects");
      let groupObj = document.getElementById("makeGroup");
      let ungroupObj = document.getElementById("unGroup");

      pickObj.onclick = () => {
        pickObj.style["background-color"] = '#54bf4b';
        groupObj.style.display = 'block';
        this.pickObjects();
      }
      groupObj.onclick = () => {
        pickObj.style["background-color"] = '#5c92ea';
        groupObj.style.display = 'none';

        this.groupObjects();
      }
      ungroupObj.onclick = () => {
        ungroupObj.style.display = 'none';
        this.ungroupObjects();
      }


      const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 60, -80), this.scene);
      //const camera = new BABYLON.ArcRotateCamera('RotateCamera', 3 * Math.PI/2, Math.PI/8, 100, BABYLON.Vector3.Zero(),this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      //camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      //camera.checkCollisions = true;
      //camera.applyGravity = true;
      this.camera = camera;

      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
      light.intensity = .75;

      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 5000, height: 5000 }, this.scene);
      const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture('textures/groundTexture.png', this.scene);
      ground.checkCollisions = true;
      groundMaterial.diffuseTexture.uScale = 350;
      groundMaterial.diffuseTexture.vScale = 350;
      groundMaterial.diffuseColor = new BABYLON.Color3(2,2,2);
      ground.material = groundMaterial;

      const room1 = new TRoom(15, 50, 50, 'room1');

      this.roomsArr = {
       room1
      };

      let box1 = new TWall(6,6,6, 'box');
      let box2 = new TWall(6,6,6, 'box2');
      let box3 = new TWall(6,6,6, 'box3');
      box1.setPosition(-10,3,0);
      box2.setPosition(0,3,0);
      box3.setPosition(10,3,0);

      
      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint, currentMeshObj, currentMesh, intersectedMesh, beginPosition;

      const getGroundPosition = () => {
        let pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh == ground) );
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }
        return null;
      }

      /* POINTER DOWN */

      this.pointerDownObserver = this.scene.onPointerObservable.add ((evt) => {
        if (evt.pickInfo.pickedMesh === null)
          return;

        if (evt.pickInfo.pickedMesh.getObject && !evt.pickInfo.pickedMesh.getObject().isPicked)
          return;

        const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh !== ground) );
        if (pickInfo.hit) {
          currentMeshObj = evt.pickInfo.pickedMesh.getObject();
          currentMesh = currentMeshObj.getMesh();

          beginPosition = new BABYLON.Vector3(currentMesh.position.x, currentMesh.position.y, currentMesh.position.z);
          startingPoint = getGroundPosition(evt);

          if (startingPoint){
            setTimeout( () => {
              camera.detachControl(map.engine.getRenderingCanvas());
            }, 0);
          }
        }
        return;

        /*
        if (evt.pickInfo.pickedMesh.getObject) {
          let pickedWall = evt.pickInfo.pickedMesh.getObject();

          if (pickedWall.getClassName() !== 'TWall')
            return;

          const pickedPoint = evt.pickInfo.pickedPoint;

          const { objPosition, xPosition } = pickedWall.getDistanceFromLeft(pickedPoint);

          elementsData.map((item) => {
            if(item === activeObjectElement) {
              new TConstruct(pickedWall, activeObjectElement, {name: 'window', height: 7, width: 7, depth: 0.5, position: objPosition, xPosition: xPosition});
            }
          });
        }
        */
      }, BABYLON.PointerEventTypes.POINTERDOWN);

      /* POINTER MOVE */   
      
      this.pointerMoveObserver = this.scene.onPointerObservable.add ((evt) => {
        if (!startingPoint) return;

        const current = getGroundPosition(evt);
        if (!current) return;

        const diff = current.subtract(startingPoint);

        if(currentMesh.getContainingWall){
          const containingWall = currentMesh.getContainingWall();
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
          
          startingPoint = current;
          return;
        }

        if(currentMesh.getGroupObj){
          currentMesh.getGroupObj().move(diff);
          startingPoint = current;
          return;
        }

        currentMesh.position.x += diff.x;
        currentMesh.position.z += diff.z;
        startingPoint = current;
      }, BABYLON.PointerEventTypes.POINTERMOVE);

      /* POINTER UP */

      this.pointerUpObserver = this.scene.onPointerObservable.add ((evt) => {
        if (startingPoint) {
          if(currentMesh.getContainingWall){
            let isIntersect = false;

            for(let i = 0; i < this.scene.meshes.length; i++) {
              if (currentMesh.intersectsMesh(this.scene.meshes[i], true) && currentMesh !== this.scene.meshes[i]){
                isIntersect = true;

                if(!this.scene.meshes[i].getObject) return;

                intersectedMesh = this.scene.meshes[i].getObject();
                if (intersectedMesh.getClassName() === 'TWall'){

                  currentMeshObj.getMesh().rotation.y = intersectedMesh.getMesh().rotation.y;

                  const pickedPoint = currentMesh.position;
                  const { objPosition, xPosition } = intersectedMesh.getDistanceFromLeft(pickedPoint);

                  currentMesh.position = objPosition;
                  const prevWall = currentMesh.getContainingWall();

                  if (intersectedMesh.isFreeSpace(currentMeshObj, xPosition, objPosition.y)) {
                    delete prevWall.getMesh(1)[currentMeshObj.name];
                    intersectedMesh.addObject(currentMeshObj, xPosition, objPosition.y);               
                  }
                  else{
                    isIntersect = false;
                  }
                }
                else{
                  isIntersect = false;
                }
                break;
              }
            }

            if (!isIntersect) {
              currentMesh.position = new BABYLON.Vector3(beginPosition.x, beginPosition.y, beginPosition.z);
              const initialWall = currentMesh.getContainingWall();

              const { xPosition } = initialWall.getDistanceFromLeft(currentMesh.position);

              initialWall.addObject(currentMeshObj, xPosition, currentMesh.position.y);
            }
          }
          camera.attachControl(map.engine.getRenderingCanvas(), true);
          startingPoint = null;
          return;
        }
        else{
          this.scene.meshes.map((item) => {
            if(item.getObject){
              item.getObject().unpick();
              document.getElementById("unGroup").style.display = 'none';
            }
          });
          const pickedMesh = evt.pickInfo.pickedMesh;
          if (pickedMesh.getObject) {
            pickedMesh.getObject().pick();
            if(pickedMesh.getGroupObj){
              pickedMesh.getGroupObj().pickAll();
              document.getElementById("unGroup").style.display = 'block';
            }
          }
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
    }

    getScene() {
      return this.scene;
    }

    pickObjects(){
      if(this.pickPointerUpObserver){
        document.getElementById("pickObjects").style["background-color"] = '#5c92ea';
        document.getElementById("makeGroup").style.display = 'none';
        
        this.scene.meshes.map((item) => {
          if(item.getObject && item.getObject().isPicked){
            item.getObject().unpick();
          }
        });

        this.groupObjects();
        return;
      }
      this.scene.onPointerObservable.remove(this.pointerDownObserver);
      this.scene.onPointerObservable.remove(this.pointerMoveObserver);
      this.scene.onPointerObservable.remove(this.pointerUpObserver);

      this.pickPointerUpObserver = this.scene.onPointerObservable.add((evt) => {
        
        if(evt.pickInfo.pickedMesh === null) return;

        if(evt.pickInfo.pickedMesh.getObject){
          const pickedMeshObj = evt.pickInfo.pickedMesh.getObject();
          if (pickedMeshObj.isPicked){
            if(pickedMeshObj.getGroupObj){
              pickedMeshObj.getGroupObj().unpickAll();
              return;
            }
            pickedMeshObj.unpick();
          }
          else{
            if(pickedMeshObj.getGroupObj){
              pickedMeshObj.getGroupObj().pickAll();
              return;
            }
            pickedMeshObj.pick();
          }
        }
      }, BABYLON.PointerEventTypes.POINTERUP);
    }

    groupObjects(){    
      this.scene.onPointerObservable.remove(this.pickPointerUpObserver);
      delete this.pickPointerUpObserver;

      this.pointerDownObserver = this.scene.onPointerObservable.add(this.pointerDownObserver.callback, BABYLON.PointerEventTypes.POINTERDOWN);
      this.pointerMoveObserver = this.scene.onPointerObservable.add(this.pointerMoveObserver.callback, BABYLON.PointerEventTypes.POINTERMOVE);
      this.pointerUpObserver = this.scene.onPointerObservable.add(this.pointerUpObserver.callback, BABYLON.PointerEventTypes.POINTERUP);  
      
      const objects = [];
      this.scene.meshes.map((item) => {
        if(item.getObject && item.getObject().isPicked){
          objects.push(item);
          item.getObject().unpick();
        }
      });

      if(objects.length < 2) return;

      let group = new TGroup(objects);      
    }
    ungroupObjects(){
      this.scene.meshes.map((item) => {
        if(item.getObject && item.getObject().isPicked){
          item.getObject().unpick();
          delete item.getObject().group;
          item.getGroupObj = null;
          item.getObject().getGroupObj = null;
        }
      });

    }
}