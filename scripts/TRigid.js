class TRigid extends TObject {
   constructor() {
      super();
      let material = new BABYLON.StandardMaterial('material', map.getScene());
      this.material = material;
      this.collision = true;
      this.addingMode = 'union';

   }

   getPosition() {
      return new BABYLON.Vector3(this.getMesh().position.x,
         this.getMesh().position.y,
         this.getMesh().position.z);
   }

   setPosition(x, y, z) {
         this.getMesh().position = new BABYLON.Vector3(x,y,z);
   }

   rotateY(alpha) {
      this.getMesh().rotation.y = alpha;
      this.rotation = alpha;
   }

   getRotationY() {
      return this.getMesh().rotation.y;
   }

   setMaterial(material) {
      this.getMesh().material = this.material = material;
   }

   setTexture(name) {
      this.material.diffuseTexture = new BABYLON.Texture(name, map.getScene());
      this.setMaterial(this.material);
   }

   scaleTexture(scale) {
      scale = 1/scale;
      this.getMesh().material.subMaterials[1].diffuseTexture.uScale = scale;
      this.getMesh().material.subMaterials[1].diffuseTexture.vScale = scale;

      this.getMesh().material.subMaterials[1].diffuseTexture.uOffset = (1 - scale)/2;
      this.getMesh().material.subMaterials[1].diffuseTexture.vOffset = (1 - scale)/2;
   }

   offsetTextureX(offset) {
      this.getMesh().material.subMaterials[1].diffuseTexture.uOffset -= offset;
   }

   offsetTextureY(offset) {
      this.getMesh().material.subMaterials[1].diffuseTexture.vOffset -= offset;
   }

   setSize(height, width, depth) {
      
      const size = newMeshes[0].getBoundingInfo().boundingBox.extendSize;      

      this.getMesh().scaling.x = width/size.x;
      this.getMesh().scaling.y = height/size.y;
      this.getMesh().scaling.x = depth/size.z;

      this.height = height;
      this.width = width;
      this.depth = depth;
   }
   
   rotateAroundPoint(point, alpha){
      this.rotateY(this.getRotationY() + alpha);
      const objPosition = this.getPosition();
      
      this.getMesh().position.x = point.x + (objPosition.x - point.x)*Math.cos(alpha) - (objPosition.z - point.z)*Math.sin(-alpha);
      this.getMesh().position.z = point.z + (objPosition.z - point.z)*Math.cos(alpha) + (objPosition.x - point.x)*Math.sin(-alpha);
   }

   getClassName() {
      return this.constructor.name;
   }
};