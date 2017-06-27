import TGroup from '../graphics/TGroup';
import { DefaultGround } from '../constants/initializer';

class TObjectControl {
  constructor(scene) {
    this.scene = scene;
  }

  getOffset() {
    return { x: this.scene.pointerX, y: this.scene.pointerY };
  }

  static move(objects, diff, check) {
    objects.forEach((mesh) => {
      if (mesh.getObject && (mesh.getObject().getClassName() === 'TWall' || mesh.getObject().getClassName() === 'T3DObject')) {
        mesh.getObject().move(diff, check);
        return;
      }
      if (check.x) mesh.position.x += diff.x;
      if (check.y) mesh.position.y += diff.y;
      if (check.z) mesh.position.z += diff.z;
    });
  }

  groupObjects(objects) {
    this.ungroupObjects(objects);
    if (objects.length > 1) {
      TGroup(objects);
      objects.forEach(object => object.getObject().unpick());
    }
  }

  static ungroupObjects(objects) {
    objects.forEach((item) => {
      item.getObject().unpick();
      delete item.getObject().group;
      item.getGroupObj = null;
      item.getObject().getGroupObj = null;
    });
  }

  static cloneObjects(objects) {
    objects.forEach(item => item.getObject().clone());
  }

  static deleteObjects(objects) {
    objects.forEach((item) => {
      if (item.getObject().getMesh(1)) {
        for (let key in item.getObject().getMesh(1)) {
          item.getObject().getMesh(1)[key].remove();
          item.getObject().getMesh(1)[key].getObject = null;
        }
      }
      if (item.getContainingWall) {
        item.getContainingWall().deleteObject(item.getObject(), item.position);
      }
      const obj = item.getObject();
      obj.unpick();
      obj.remove();
      item.getObject = null;
    });
  }

  adheranceObject(object) {
    const ground = this.scene.meshes.filter(mesh => mesh.name === DefaultGround.name)[0];
    for (let i = 0; i < this.scene.meshes.length; i += 1) {
      const mesh = this.scene.meshes[i];
      if (mesh === object || mesh === ground || !mesh.getObject || mesh.name.includes('Wrap') || mesh.intersectsMesh(object)) continue;

      const distanceInfo = object.getObject().getDistanceFromObject(mesh.getObject());

      if (!distanceInfo) break;

      if (distanceInfo.dist < 2.5) {
        object.getObject().move(distanceInfo.diff, { x: true, y: false, z: true });
        object.isPin = true;
        break;
      }
    }
  }
}

export default TObjectControl;
