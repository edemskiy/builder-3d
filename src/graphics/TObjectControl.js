const BABYLON = window.BABYLON;
import TGroup from '../graphics/TGroup'
import { DefaultGround } from '../constants/initializer'

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


  groupObjects(objects){
    if(objects.length > 1) {
      new TGroup(objects);
      objects.forEach( object => object.getObject().unpick() );
    }
  }

  ungroupObjects(objects){
    objects.forEach( (item) => {        
      item.getObject().unpick();
      delete item.getObject().group;
      item.getGroupObj = null;
      item.getObject().getGroupObj = null;
    });
  }

  cloneObjects(objects){
    objects.forEach( (item) => item.getObject().clone() );
  }

  deleteObjects(objects){
    objects.forEach((item) => {
      let obj = item.getObject();
      obj.unpick();
      obj.remove();
      item.getObject = null;
    });
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
    adheranceObject(currentMesh){
      const ground = this.scene.meshes.filter( (mesh) => mesh.name === DefaultGround.name )[0];
      for(let i = 0; i < this.scene.meshes.length; i++){

        const mesh = this.scene.meshes[i];
        if(mesh === currentMesh || mesh === ground || !mesh.getObject || mesh.name.includes("Wrap") || mesh.intersectsMesh(currentMesh)) continue;

        const distanceInfo = currentMesh.getObject().getDistanceFromObject(mesh.getObject());

        if(!distanceInfo) break;

        if (distanceInfo.dist < 2.5) {
         currentMesh.position.x += distanceInfo.diff.x;
         currentMesh.position.z += distanceInfo.diff.z;
         currentMesh.isPin = true;
         //offset = {x: this.scene.pointerX, y: this.scene.pointerY}; // ???
         break;
       }
     }
   }
}

export default TObjectControl;