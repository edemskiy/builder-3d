class TWall extends TRigid{
   constructor(height,width,scene){
      super(scene);
      let wall = new BABYLON.Mesh.CreatePlane("wall", height, scene);
      wall.scaling.x = width/height;
      wall.checkCollisions = this.collision;
      wall.size = height;
      this.addMesh(wall);
      this.height = height;
      this.width = width;
      this.rotation = 0;
   }
   setPosition(x, y, z){
      if(this.meshArr.length === 1){
         this.getMesh(0).position = new BABYLON.Vector3(x,y,z);
      }
   }
   rotateY(alpha){
      this.getMesh(0).rotation.y = alpha;
      this.rotation = alpha;
   }
   setSize(height, width){
      this.getMesh(0).scaling.y = height/this.getMesh(0).size;
      this.getMesh(0).scaling.x = width/this.getMesh(0).size;
   }
   getPosition(){
      return {
         x: this.getMesh(0).position.x,
         y: this.getMesh(0).position.y,
         z: this.getMesh(0).position.z
      }
   }
   addDoor(height, width, from, scene){
      this.setSize(this.height - height, this.width);
      let currPos = this.getPosition();
      this.setPosition(currPos.x, currPos.y + height/2, currPos.z);
      
      let leftWall = new BABYLON.Mesh.CreatePlane("leftWall", height, scene);
      leftWall.scaling.x = from/height;
      leftWall.rotation.y = this.rotation;

      let rightWall = new BABYLON.Mesh.CreatePlane("rightWall", height, scene);
      rightWall.width = this.width - from - width;
      rightWall.scaling.x = rightWall.width/height;
      rightWall.rotation.y = this.rotation;

      leftWall.position = new BABYLON.Vector3(currPos.x - Math.cos(this.rotation) * (this.width/2 - from/2), 
         currPos.y - this.height/2 + height/2,
         currPos.z - Math.sin(this.rotation) * (this.width/2 - from/2));
      
      rightWall.position = new BABYLON.Vector3(leftWall.position.x + (from/2 + width + rightWall.width/2) * Math.cos(this.rotation), //position.x
         currPos.y - this.height/2 + height/2, // position.y
         leftWall.position.z + (from/2 + width + rightWall.width/2) * Math.sin(this.rotation)); // position.z

      leftWall.material = rightWall.material = this.material;

      leftWall.checkCollisions = rightWall.checkCollisions = this.collision;

      this.meshArr.push(leftWall);
      this.meshArr.push(rightWall);
   }
};