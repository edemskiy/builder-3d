class TObject {
   constructor() {
      this.meshArr = [];
   }

   addMesh(mesh) {
      this.meshArr.push(mesh);
   }

   getMesh(n) {
      n = n || 0;
      return this.meshArr[n];
   }

   getBabylon() {
      return this.meshArr;
   }
};

export default TObject