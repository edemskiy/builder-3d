// eslint-disable-next-line
const BABYLON = window.BABYLON;
import TObject from './TObject.js'

class TRigid extends TObject {
   constructor(scene) {
      super();

      this.scene = scene;
      let material = new BABYLON.StandardMaterial('material', this.scene);
      this.material = material;
      this.collision = true;
      this.addingMode = 'union';
      this.isPicked = false;
      this.isPinned = false;

      this.rotation = 0;
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


      const diff = new BABYLON.Vector3(x,y,z).subtract(this.getPosition());
      this.move(diff, {x:true, y:true, z:true});
   }

   rotateY(alpha) {
      alpha %= (2*Math.PI);
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
      this.material.diffuseTexture = new BABYLON.Texture('data:name'+name.length, this.scene, true,
                  true, BABYLON.Texture.BILINEAR_SAMPLINGMODE,
                  null, null, name, true);
      this.setMaterial(this.material);
   }

   scaleTexture(scale) {
      scale = 1/scale;
      // this.getMesh().material.subMaterials[1].diffuseTexture.uScale = scale;
      // this.getMesh().material.subMaterials[1].diffuseTexture.vScale = scale;

      // this.getMesh().material.subMaterials[1].diffuseTexture.uOffset = (1 - scale)/2;
      // this.getMesh().material.subMaterials[1].diffuseTexture.vOffset = (1 - scale)/2;


      this.getMesh().material.diffuseTexture.uScale = scale;
      this.getMesh().material.diffuseTexture.vScale = scale;

      this.getMesh().material.diffuseTexture.uOffset = (1 - scale)/2;
      this.getMesh().material.diffuseTexture.vOffset = (1 - scale)/2;

   }

   offsetTextureX(offset) {
      //this.getMesh().material.subMaterials[1].diffuseTexture.uOffset = offset;
      this.getMesh().material.diffuseTexture.uOffset = offset;
   }

   offsetTextureY(offset) {
      //this.getMesh().material.subMaterials[1].diffuseTexture.vOffset = offset;
      this.getMesh().material.diffuseTexture.vOffset = offset;
   }

   pick(){
      if (this.isPicked) return;
      
      this.isPicked = true;
      const size = this.getMesh().getBoundingInfo().boundingBox.extendSize;
      //const size = this.getMesh().scaling;
      this.wrapMesh = BABYLON.MeshBuilder.CreateBox(this.name + "Wrap", {height: size.y*2 + 0.3, width: size.x*2 + 0.3, depth: size.z*2 + 0.3, updateble: true}, this.scene);
      //this.wrapMesh = BABYLON.MeshBuilder.CreateBox(this.name + "Wrap", {height: size.y, width: size.x, depth: size.z, updateble: true}, this.scene);
      
      this.wrapMesh.getObject = () => this.getMesh().getObject();
      
      const wrapMeshMaterial = new BABYLON.StandardMaterial('wrapMaterial', this.scene);
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
      let wall;
      if(this.getMesh().getContainingWall){
         wall = this.getMesh().getContainingWall();
         wall.deleteObject(this, this.getPosition());
      }

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

      if(wall)
         wall.addObject(this);
   }
   
   rotateAroundPoint(point, alpha){
      const alphaOld = alpha;
      alpha -= this.getRotationY();
      this.rotateY(alpha + this.getRotationY());
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
      
         tmp.getMesh().material = tmp.material = this.material.clone();
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

   getDistanceFromObject(object){
      const endpoints = this.getEndpoints();
      const endpointsMesh = object.getEndpoints();

      const left = endpointsMesh.x.max < endpoints.x.min;
      const right = endpoints.x.max < endpointsMesh.x.min;
      const bottom = endpointsMesh.z.max < endpoints.z.min;
      const top = endpoints.z.max < endpointsMesh.z.min;

      if (top && left)
        return { 
         dist: Math.sqrt((endpoints.x.min - endpointsMesh.x.max) ** 2 + (endpoints.z.max - endpointsMesh.z.min) ** 2),
         diff: new BABYLON.Vector3(endpointsMesh.x.max - endpoints.x.min, 0, endpointsMesh.z.min - endpoints.z.max)
      };

      else if(left && bottom)
        return {
         dist: Math.sqrt((endpoints.x.min - endpointsMesh.x.max) ** 2 + (endpoints.z.min - endpointsMesh.z.max) ** 2),
         diff: new BABYLON.Vector3(endpointsMesh.x.max - endpoints.x.min, 0, endpointsMesh.z.max - endpoints.z.min)
      };

      else if(bottom && right)
        return {
         dist: Math.sqrt((endpoints.x.max - endpointsMesh.x.min) ** 2 + (endpoints.z.min - endpointsMesh.z.max) ** 2),
         diff: new BABYLON.Vector3(endpointsMesh.x.min - endpoints.x.max, 0, endpointsMesh.z.max - endpoints.z.min)
      };

      else if(right && top)
        return {
         dist: Math.sqrt((endpoints.x.max - endpointsMesh.x.min) ** 2 + (endpoints.z.max - endpointsMesh.z.min) ** 2),
         diff: new BABYLON.Vector3(endpointsMesh.x.min - endpoints.x.max, 0, endpointsMesh.z.min - endpoints.z.max)
      };

      else if(left)
        return {
         dist: endpoints.x.min - endpointsMesh.x.max,
         diff: new BABYLON.Vector3(endpointsMesh.x.max - endpoints.x.min, 0, 0)
      };

      else if(right)
        return {
         dist: endpointsMesh.x.min - endpoints.x.max,
         diff: new BABYLON.Vector3(endpointsMesh.x.min - endpoints.x.max, 0, 0)
      };

      else if(bottom)
        return {
         dist: endpoints.z.min - endpointsMesh.z.max,
         diff: new BABYLON.Vector3(0, 0, endpointsMesh.z.max - endpoints.z.min)
      };

      else if(top)
        return {
         dist: endpointsMesh.z.min - endpoints.z.max,
         diff: new BABYLON.Vector3(0, 0, endpointsMesh.z.min - endpoints.z.max)
      };
   }
};

export default TRigid