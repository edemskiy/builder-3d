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
   setSize(height, width, depth){
      var size = newMeshes[0].getBoundingInfo().boundingBox.extendSize;      

      this.getMesh(0).scaling.x = width/size.x;
      this.getMesh(0).scaling.y = height/size.y;
      this.getMesh(0).scaling.x = depth/size.z;

      this.height = height;
      this.width = width;
      this.depth = depth;
   }

};