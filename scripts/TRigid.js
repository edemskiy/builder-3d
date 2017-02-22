class TRigid extends TObject {
   constructor() {
      super();

      let material = new BABYLON.StandardMaterial('material', map.getScene());
      this.material = material;
      this.collision = true;
      this.addingMode = 'union';
      this.isPicked = false;
      this.isPinned = false;
   }

   getPosition() {
      return new BABYLON.Vector3(this.getMesh().position.x,
         this.getMesh().position.y,
         this.getMesh().position.z);
   }

   setPosition(x, y, z) {
      if(x === undefined) x = this.getPosition().x;
      if(y === undefined) y = this.getPosition().y;
      if(z === undefined) z = this.getPosition().z;

      this.getMesh().position = new BABYLON.Vector3(x,y,z);
   }

   rotateY(alpha) {
      alpha = alpha % (2*Math.PI);
      this.getMesh().rotation.y = alpha;
      this.rotation = alpha;
   }

   remove() {
         this.getMesh().dispose();
   }

   getRotationY() {
      return this.rotation;
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

   pick(){
      if (this.isPicked) return;
      
      this.isPicked = true;
      const size = this.getMesh().getBoundingInfo().boundingBox.extendSize;
      //const size = this.getMesh().scaling;
      this.wrapMesh = BABYLON.MeshBuilder.CreateBox(this.name + "Wrap", {height: size.y*2 + 0.3, width: size.x*2 + 0.3, depth: size.z*2 + 0.3, updateble: true}, map.getScene());
      //this.wrapMesh = BABYLON.MeshBuilder.CreateBox(this.name + "Wrap", {height: size.y, width: size.x, depth: size.z, updateble: true}, map.getScene());
      
      this.wrapMesh.getObject = () => this.getMesh().getObject();
      
      const wrapMeshMaterial = new BABYLON.StandardMaterial('wrapMaterial', map.getScene());
      wrapMeshMaterial.wireframe = true;
      wrapMeshMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
      this.wrapMesh.material = wrapMeshMaterial;
      this.wrapMesh.parent = this.getMesh();      
   }

   unpick(){
      if(!this.isPicked) return;

      this.isPicked = false;
      if(this.wrapMesh)
         this.wrapMesh.dispose();
   }

   setSize(height, width, depth) {

      height = height || this.height;
      width = width || this.width;
      depth = depth || this.depth;
      
      let size = this.getMesh().getBoundingInfo().boundingBox.extendSize;

      this.getMesh().scaling.x = 0.5*width/size.x;
      this.getMesh().scaling.y = 0.5*height/size.y;
      this.getMesh().scaling.z = 0.5*depth/size.z;

      this.getMesh().position.y += (height - this.height)/2;
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

   clone(){
      const constr = this.getMesh().getObject().constructor;
      let tmp = new constr(this.args);
      
      tmp.getMesh().material = tmp.material = this.material;
      tmp.rotateY(this.getRotationY());
      tmp.getMesh().scaling = new BABYLON.Vector3(this.getMesh().scaling.x, this.getMesh().scaling.y, this.getMesh().scaling.z) ;
      
      const pos = this.getPosition();
      const endpoints = this.getEndpoints();
      tmp.setPosition(pos.x + endpoints.x.max - endpoints.x.min + 5, pos.y, pos.z);

      return tmp;
   }

   getEndpoints(){
      const currPos = this.getPosition();
      const alpha = -this.getRotationY();

      let arr = [new BABYLON.Vector3(currPos.x + this.width/2, 1, currPos.z + this.depth/2),
         new BABYLON.Vector3(currPos.x + this.width/2, 0, currPos.z - this.depth/2),
         new BABYLON.Vector3(currPos.x - this.width/2, 0, currPos.z + this.depth/2),
         new BABYLON.Vector3(currPos.x - this.width/2, 0, currPos.z - this.depth/2),
         ];

      let newArr = arr.map((item) => {
         
         return new BABYLON.Vector3(currPos.x + (item.x - currPos.x)*Math.cos(alpha) - (item.z - currPos.z)*Math.sin(-alpha),
           0,
           currPos.z + (item.z - currPos.z)*Math.cos(alpha) + (item.x - currPos.x)*Math.sin(-alpha));
      });

      const xArr = newArr.map(item => item.x);
      const zArr = newArr.map(item => item.z);

      return { 
         x: {
            min: Math.min.apply(Math, xArr),
            max: Math.max.apply(Math, xArr),
         },
         z: {
            min: Math.min.apply(Math, zArr),
            max: Math.max.apply(Math, zArr),
         }
      };
   }
};