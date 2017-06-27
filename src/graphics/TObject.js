class TObject {
  constructor() {
    this.meshArr = [];
  }

  addMesh(mesh) {
    this.meshArr.push(mesh);
  }

  getMesh(n) {
    return this.meshArr[n || 0];
  }
}

export default TObject;
