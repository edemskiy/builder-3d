class TWall extends TRigid{
   constructor(height, width, scene){
      super(scene);
      let wall = BABYLON.MeshBuilder.CreateBox("wall", {height: height, width: width, depth: 0.5}, scene);
      wall.checkCollisions = this.collision;
      wall.height = height;
      wall.width = width;
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
      this.getMesh(0).scaling.y = height/this.getMesh(0).height;
      this.getMesh(0).scaling.x = width/this.getMesh(0).width;
   }
   getPosition(){
      return {
         x: this.getMesh(0).position.x,
         y: this.getMesh(0).position.y,
         z: this.getMesh(0).position.z
      }
   }
   remove(){
      if(this.meshArr.length === 1)
         this.getMesh(0).dispose();
   }
   addDoor(height, width, from, scene){
      if(this.meshArr.length === 1){  //if wall has no doors
         this.setSize(this.height - height, this.width);
         let currPos = this.getPosition();
         this.setPosition(currPos.x, currPos.y + height/2, currPos.z);
      
         let leftWall = new TWall(height, from, scene);
         leftWall.rotateY(this.rotation);

         let rightWall = new TWall(height, this.width - from - width, scene);
         rightWall.rotateY(this.rotation);

         leftWall.setPosition(currPos.x - Math.cos(this.rotation) * (this.width/2 - from/2), 
            currPos.y - this.height/2 + height/2,
            currPos.z - Math.sin(this.rotation) * (this.width/2 - from/2));

         rightWall.setPosition(leftWall.getPosition().x + (from/2 + width + rightWall.width/2) * Math.cos(this.rotation),
            currPos.y - this.height/2 + height/2,
            leftWall.getPosition().z + (from/2 + width + rightWall.width/2) * Math.sin(this.rotation));

         leftWall.setMaterial(this.material);
         rightWall.setMaterial(this.material);

         this.meshArr.push(leftWall);
         this.meshArr.push(rightWall);
      }
      if(from + width < this.getMesh(1).width)
         this.getMesh(1).addDoor(height, width, from, scene);

      if(from > this.width - this.getMesh(2).width)
         this.getMesh(2).addDoor(height, width, from - (this.width - this.getMesh(2).width), scene);
   }
};