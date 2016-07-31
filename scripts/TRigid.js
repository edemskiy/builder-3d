class TRigid extends TObject{
   constructor(scene){
      super();
      let material = new BABYLON.StandardMaterial("material", scene);
      this.material = material;
      this.collision = true;
   }
   setMaterial(material){
      for(let i = 0; i < this.meshArr.length; i++){
         this.getMesh(i).material = this.material = material;
      }
   }
};