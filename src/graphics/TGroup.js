import TObject from './TObject';

// eslint-disable-next-line
const BABYLON = window.BABYLON;

class TGroup extends TObject {
  constructor(objects) {
    super();
    this.objArr = objects;
    this.objArr.forEach((item) => {
      item.getGroupObj = () => this;
      item.getObject().getGroupObj = () => this;
    });

    this.center = new BABYLON.Vector3.Zero();

    const xArr = this.objArr.map(item => item.position.x);
    const yArr = this.objArr.map(item => item.position.y);
    const zArr = this.objArr.map(item => item.position.z);

    this.center.x = (Math.max(...xArr) + Math.min(...xArr)) / 2;
    this.center.y = (Math.max(...yArr) + Math.min(...yArr)) / 2;
    this.center.z = (Math.max(...zArr) + Math.min(...zArr)) / 2;

    this.rotation = 0;
  }

  move(diff, check) {
    this.objArr.forEach(item => item.getObject().move(diff, check));

    if (check.x) this.center.x += diff.x;
    if (check.y) this.center.y += diff.y;
    if (check.z) this.center.z += diff.z;
  }

  getCenter() {
    return this.center;
  }

  setPosition(x, y, z) {
    x = x || this.center.x;
    y = y || this.center.y;
    z = z || this.center.z;

    const diff = new BABYLON.Vector3(x, y, z).subtract(this.center);
    this.move(diff, { x: true, y: true, z: true });
  }

  rotateY(alpha) {
    this.objArr.forEach(item => item.getObject()
      .rotateAroundPoint(this.center, alpha - this.rotation));
    this.rotation = alpha;
  }

  pickAll() {
    this.objArr.forEach(item => item.getObject().pick());
  }

  unpickAll() {
    this.objArr.forEach(item => item.getObject().unpick());
  }

  clone() {
    const newObjArr = this.objArr.map(item => item.getObject().clone().getMesh());
    TGroup(newObjArr);
  }

  getRotationY() {
    return this.rotation;
  }

}

export default TGroup;
