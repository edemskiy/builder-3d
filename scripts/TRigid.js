class TRigid extends TObject{
   constructor(){
      super();
      let material = new BABYLON.StandardMaterial("material", map.getScene());
      this.material = material;
      this.collision = true;
      this.addingMode = "union";
   }
   setMaterial(material){
      for(let i = 0; i < this.meshArr.length; i++){
         this.getMesh(i).material = this.material = material;
      }
   }
};