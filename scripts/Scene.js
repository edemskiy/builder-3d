class Scene {
   constructor (engine) {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0);
      this.scene = scene;

      this.cloneObject = this.cloneObject.bind(this);
      this.pickObjects = this.pickObjects.bind(this);
      this.groupObjects = this.groupObjects.bind(this);
      this.ungroupObjects = this.ungroupObjects.bind(this);
      this.deleteObject = this.deleteObject.bind(this);
      this.changeSize = this.changeSize.bind(this);
      this.rotateObjectY = this.rotateObjectY.bind(this);
      this.changeObjectPosition = this.changeObjectPosition.bind(this);
    }

    createScene() {
      /* -----------------------------------------*/

      const pickObj = document.getElementById("pickObjects");
      const groupObj = document.getElementById("makeGroup");
      const ungroupObj = document.getElementById("unGroup");
      const cloneObj = document.getElementById("cloneObject");
      const deleteObj = document.getElementById("deleteObject");


      document.getElementById("changeSize").oninput = this.changeSize;
      document.getElementById("rotateObjectY").oninput = this.rotateObjectY;
      document.getElementById("changePosition").oninput = this.changeObjectPosition;

      const axisX = document.getElementById("axisX");
      const axisY = document.getElementById("axisY");
      const axisZ = document.getElementById("axisZ");

      const objectsStick = document.getElementById("objectsStick");
      const gridStick = document.getElementById("gridStick");

      axisY.onchange = (e) => { axisZ.checked = axisX.checked = !e.target.checked; };
      axisX.onchange = () => { axisY.checked = false; };
      axisZ.onchange = () => { axisY.checked = false; };

      pickObj.onclick = this.pickObjects;
      groupObj.onclick = this.groupObjects;
      ungroupObj.onclick = this.ungroupObjects;
      cloneObj.onclick = this.cloneObject;
      deleteObj.onclick = this.deleteObject;

      /* -----------------------------------------*/

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

      const room1 = new TRoom(20, 50, 50, 'room1');
      
      let elementsData = [TWindow, TDoor, T3DObject];

      let activeObjectElement = T3DObject;
      
      let startingPoint, currentMeshObj, currentMesh, intersectedMesh, beginPosition, offset;

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

          offset = {x: this.scene.pointerX, y: this.scene.pointerY};

          beginPosition = new BABYLON.Vector3(currentMesh.position.x, currentMesh.position.y, currentMesh.position.z);
          startingPoint = getGroundPosition(evt);

          if (startingPoint){
            setTimeout( () => {
              camera.detachControl(map.engine.getRenderingCanvas());
            }, 0);
          }
        }
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

        if (currentMesh.isPin) {
          if(Math.sqrt( (offset.x - this.scene.pointerX)**2 + (offset.y - this.scene.pointerY)**2 ) < 50)
            return;
          else currentMesh.isPin = false;
        }
        
        if(currentMesh.getGroupObj){
          diff.y = (offset.y - this.scene.pointerY)/10
          currentMesh.getGroupObj().move(diff, {x: axisX.checked, y: axisY.checked, z: axisZ.checked});
          offset = {x: this.scene.pointerX, y: this.scene.pointerY};
          startingPoint = current;
          return;
        }

        if(axisX.checked) currentMesh.position.x += diff.x;
        if(axisY.checked){
          currentMesh.position.y += (offset.y - this.scene.pointerY)/10;
          offset = {x: this.scene.pointerX, y: this.scene.pointerY};
        }
        if(axisZ.checked) currentMesh.position.z += diff.z;

        if(objectsStick.checked){
          for(let i = 0; i < this.scene.meshes.length; i++){
            
            const mesh = this.scene.meshes[i];
            if(mesh === currentMesh || mesh === ground || !mesh.getObject || mesh.name.includes("Wrap") || mesh.intersectsMesh(currentMesh)) continue;

            const distanceInfo = currentMeshObj.getDistanceFromObject(mesh.getObject());

            if(!distanceInfo) break;

            if (distanceInfo.dist < 2.5) {
             currentMesh.position.x += distanceInfo.diff.x;
             currentMesh.position.z += distanceInfo.diff.z;
             currentMesh.isPin = true;
             offset = {x: this.scene.pointerX, y: this.scene.pointerY};
             break;
           }
          }
        }

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
          if (currentMesh.getObject) {
            if(currentMesh.getGroupObj){
              document.getElementById("xPosition").value = currentMesh.getGroupObj().getCenter().x.toFixed(1);
              document.getElementById("yPosition").value = currentMesh.getGroupObj().getCenter().y.toFixed(1);
              document.getElementById("zPosition").value = currentMesh.getGroupObj().getCenter().z.toFixed(1);
            }
            else{
              document.getElementById("xPosition").value = currentMesh.getObject().getPosition().x.toFixed(1);
              document.getElementById("yPosition").value = currentMesh.getObject().getPosition().y.toFixed(1);
              document.getElementById("zPosition").value = currentMesh.getObject().getPosition().z.toFixed(1);
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
              document.getElementById("objectControls").style.display = "none";
            }
          });
          if(evt.pickInfo.pickedMesh === null) return;
          const pickedMesh = evt.pickInfo.pickedMesh;
          if (pickedMesh.getObject) {
            pickedMesh.getObject().pick();

            document.getElementById("objectControls").style.display = "block";

            document.getElementById("changeSizeX").value = pickedMesh.getObject().width;
            document.getElementById("changeSizeY").value = pickedMesh.getObject().height;
            document.getElementById("changeSizeZ").value = pickedMesh.getObject().depth;

            if(pickedMesh.getGroupObj){
              document.getElementById("xPosition").value = pickedMesh.getGroupObj().getCenter().x.toFixed(1);
              document.getElementById("yPosition").value = pickedMesh.getGroupObj().getCenter().y.toFixed(1);
              document.getElementById("zPosition").value = pickedMesh.getGroupObj().getCenter().z.toFixed(1);
            }
            else{
              document.getElementById("xPosition").value = pickedMesh.getObject().getPosition().x.toFixed(1);
              document.getElementById("yPosition").value = pickedMesh.getObject().getPosition().y.toFixed(1);
              document.getElementById("zPosition").value = pickedMesh.getObject().getPosition().z.toFixed(1);
            }

            document.getElementById("rotateObjectY").value = (pickedMesh.getObject().getRotationY() * 180)/Math.PI;

            if(pickedMesh.getGroupObj){
              pickedMesh.getGroupObj().pickAll();
              document.getElementById("rotateObjectY").value = (pickedMesh.getGroupObj().getRotationY() * 180)/Math.PI;
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
      document.getElementById("pickObjects").style["background-color"] = '#54bf4b';
      document.getElementById("makeGroup").style.display = 'block';

      if(this.pickPointerUpObserver){
        document.getElementById("pickObjects").style["background-color"] = '#5c92ea';
        document.getElementById("makeGroup").style.display = 'none';
        document.getElementById("objectControls").style.display = 'none';
        
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

      document.getElementById("pickObjects").style["background-color"] = '#5c92ea';
      document.getElementById("makeGroup").style.display = 'none';
      document.getElementById("objectControls").style.display = 'none';

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
      document.getElementById("objectControls").style.display = "none";
      this.scene.meshes.map((item) => {
        if(item.getObject && item.getObject().isPicked){
          item.getObject().unpick();
          delete item.getObject().group;
          item.getGroupObj = null;
          item.getObject().getGroupObj = null;
        }
      });
    }

    cloneObject(){
      let objects = [];
      this.scene.meshes.map((item) => {
        if(item.name.includes("Wrap")) return;
        
        if(item.getObject && item.getObject().isPicked)
          if(item.getGroupObj){
            objects.push(item.getGroupObj());
            item.getGroupObj().unpickAll();
          }
          else
            objects.push(item.getObject());
      });

      objects.map( (item) => item.clone() );
    }

    deleteObject(){
      document.getElementById("objectControls").style.display = "none";
      let objects = [];
      this.scene.meshes.map((item) => {
        if(item.name.includes("Wrap")) return;
        
        if(item.getObject && item.getObject().isPicked)
            objects.push(item);
      });

      objects.map((item) => {
        let obj = item.getObject();
        obj.unpick();
        obj.remove();
        item.getObject = null;
      })
    }

    changeSize(evt){
      let value = evt.target.value;
      if(value < 0) evt.target.value = 0.1;

      let targetMesh, height, width, depth;
      if (evt.target.id.includes('SizeX')) width = value;
      else if(evt.target.id.includes('SizeY')) height = value;
      else if(evt.target.id.includes('SizeZ')) depth = value;

      for(let i = 0; i < this.scene.meshes.length; i++){
        targetMesh = this.scene.meshes[i];
        if (targetMesh.getObject && targetMesh.getObject().isPicked) {
          targetMesh.getObject().setSize(height, width, depth);
          //break;
        }
      }
    }

    rotateObjectY(evt){
      let targetMesh;
      for(let i = 0; i < this.scene.meshes.length; i++){
        targetMesh = this.scene.meshes[i];
        if (targetMesh.getObject && targetMesh.getObject().isPicked){
          if(targetMesh.getGroupObj)
            targetMesh.getGroupObj().rotateY((Math.sign((evt.target.value*Math.PI)/180 - targetMesh.getGroupObj().getRotationY()) * Math.PI)/180);
          else
            targetMesh.getObject().rotateY((evt.target.value * Math.PI)/180);
          break;
        }
      }
    }

    changeObjectPosition(evt){
      let value = +evt.target.value;
      let x, y, z, targetMesh;
      if (evt.target.id.includes('x')) x = value;
      else if(evt.target.id.includes('y')) y = value;
      else if(evt.target.id.includes('z')) z = value;

      for(let i = 0; i < this.scene.meshes.length; i++){
        targetMesh = this.scene.meshes[i];

        if(targetMesh.name.includes("Wrap")) return;        

        if(targetMesh.getObject && targetMesh.getObject().isPicked){
          if(targetMesh.getGroupObj){
            targetMesh.getGroupObj().setPosition(x, y, z);
            return;
          }
          else
            targetMesh.getObject().setPosition(x, y, z);
        }
      }
    }
}