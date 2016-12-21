class TRigid extends TObject {
   constructor() {
      super();
      let material = new BABYLON.StandardMaterial('material', map.getScene());
      this.material = material;
      this.collision = true;
      this.addingMode = 'union';

   }

   getPosition() {
      return new BABYLON.Vector3(this.getMesh(0).position.x,
         this.getMesh(0).position.y,
         this.getMesh(0).position.z);
   }

   setPosition(x, y, z) {
         this.getMesh(0).position = new BABYLON.Vector3(x,y,z);
   }

   rotateY(alpha) {
      this.getMesh(0).rotation.y = alpha;
      this.rotation = alpha;
   }

   getRotationY() {
      return this.getMesh(0).rotation.y;
   }

   setMaterial(material) {
      this.getMesh(0).material = this.material = material;
   }

   setTexture(name) {
      this.material.diffuseTexture = new BABYLON.Texture(name, map.getScene());
      this.setMaterial(this.material);
   }

   scaleTexture(scale) {
      scale = 1/scale;
      this.getMesh(0).material.diffuseTexture.uScale = scale;
      this.getMesh(0).material.diffuseTexture.vScale = scale;

      this.getMesh(0).material.diffuseTexture.uOffset = (1 - scale)/2;
      this.getMesh(0).material.diffuseTexture.vOffset = (1 - scale)/2;
   }

   offsetTextureX(offset) {
      this.getMesh(0).material.diffuseTexture.uOffset -= offset;
   }

   offsetTextureY(offset) {
      this.getMesh(0).material.diffuseTexture.vOffset -= offset;
   }

   setSize(height, width, depth) {
      const size = newMeshes[0].getBoundingInfo().boundingBox.extendSize;      

      this.getMesh(0).scaling.x = width/size.x;
      this.getMesh(0).scaling.y = height/size.y;
      this.getMesh(0).scaling.x = depth/size.z;

      this.height = height;
      this.width = width;
      this.depth = depth;
   }
   
   rotateAroundPoint(point, alpha){
      this.rotateY(this.getRotationY() + alpha);
      const objPosition = this.getPosition();
      
      this.getMesh(0).position.x = point.x + (objPosition.x - point.x)*Math.cos(alpha) - (objPosition.z - point.z)*Math.sin(-alpha);
      this.getMesh(0).position.z = point.z + (objPosition.z - point.z)*Math.cos(alpha) + (objPosition.x - point.x)*Math.sin(-alpha);
   }

   getClassName() {
      return this.constructor.name;
   }
};