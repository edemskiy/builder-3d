const BABYLON = window.BABYLON;
import TGroup from '../graphics/TGroup'

class TObjectControl{
	constructor(scene){
		this.scene = scene;
	}

	getMeshPosition(mesh){
		return BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
	}

	getOffset(){
		return { x:this.scene.pointerX, y:this.scene.pointerY };
	}

	move(objects, diff, check){
		objects.forEach( (mesh) => {
			if(check.x) mesh.position.x += diff.x;
			if(check.y) mesh.position.y += diff.y;
			if(check.z) mesh.position.z += diff.z;
		});
	}

	pickObjects(pickObs, pDownObs, pMoveObs, pUpObs){

      if(pickObs){ 
        this.scene.meshes.forEach((item) => {
          if(item.getObject && item.getObject().isPicked){
            item.getObject().unpick();
          }
        });

        this.groupObjects();
        return;
      }
      this.scene.onPointerObservable.remove(pDownObs);
      this.scene.onPointerObservable.remove(pMoveObs);
      this.scene.onPointerObservable.remove(pUpObs);

      const pickPointerUpObserver = this.scene.onPointerObservable.add((evt) => {
        
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
      return pickPointerUpObserver;
    }

    groupObjects(pickedObjects, pickObs, pDownObs, pMoveObs, pUpObs){

      this.scene.onPointerObservable.remove(pickObs);
      pickObs = undefined;

      const pointerDownObserver = this.scene.onPointerObservable.add(pDownObs.callback, BABYLON.PointerEventTypes.POINTERDOWN);
      const pointerMoveObserver = this.scene.onPointerObservable.add(pMoveObs.callback, BABYLON.PointerEventTypes.POINTERMOVE);
      const pointerUpObserver = this.scene.onPointerObservable.add(pUpObs.callback, BABYLON.PointerEventTypes.POINTERUP);  

      if(pickedObjects.length > 1){
      	new TGroup(pickedObjects);
      }

      return {pointerDownObserver, pointerMoveObserver, pointerUpObserver};
    }

    ungroupObjects(){
      this.scene.meshes.forEach((item) => {
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
      this.scene.meshes.forEach((item) => {
        if(item.name.includes("Wrap")) return;
        
        if(item.getObject && item.getObject().isPicked)
          if(item.getGroupObj){
            objects.push(item.getGroupObj());
            item.getGroupObj().unpickAll();
          }
          else
            objects.push(item.getObject());
      });

      objects.forEach( (item) => item.clone() );
    }

    deleteObject(){
      let objects = [];
      this.scene.meshes.forEach((item) => {
        if(item.name.includes("Wrap")) return;
        
        if(item.getObject && item.getObject().isPicked)
            objects.push(item);
      });

      objects.forEach((item) => {
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

export default TObjectControl;