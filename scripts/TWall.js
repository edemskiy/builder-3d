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
   /* На одну стену можно добавить несколько окон, только если они одной высоты и находятся на одном уровне. */
   addWindow(height, width, xPos, yPos, scene){
      if(this.meshArr.length === 1){
         let currPos = this.getPosition();
         
         this.setSize(this.height - height - yPos, this.width);
         this.setPosition(currPos.x, currPos.y + this.height/2 - (this.height - height - yPos)/2 , currPos.z);

         let leftWall = new TWall(height, xPos, scene);
         leftWall.rotateY(this.rotation);

         let rightWall = new TWall(height, this.width - xPos - width, scene);
         rightWall.rotateY(this.rotation);

         leftWall.setPosition(currPos.x - Math.cos(this.rotation) * (this.width/2 - xPos/2), 
            currPos.y - this.height/2 + height/2 + yPos,
            currPos.z + Math.sin(this.rotation) * (this.width/2 - xPos/2));

         rightWall.setPosition(leftWall.getPosition().x + (xPos/2 + width + rightWall.width/2) * Math.cos(this.rotation),
            currPos.y - this.height/2 + height/2 + yPos,
            leftWall.getPosition().z - (xPos/2 + width + rightWall.width/2) * Math.sin(this.rotation));

         leftWall.setMaterial(this.material);
         rightWall.setMaterial(this.material);

         this.addMesh(leftWall);
         this.addMesh(rightWall);

         if(yPos !== 0){
            let bottomWall = new TWall(yPos, this.width, scene);
            bottomWall.rotateY(this.rotation);
            bottomWall.setPosition(currPos.x, currPos.y - this.height/2 + yPos/2, currPos.z);
            bottomWall.setMaterial(this.material);
            this.addMesh(bottomWall);
         }
      }
      if(xPos + width < this.getMesh(1).width && height <= this.getMesh(1).height)
         this.getMesh(1).addWindow(height + 1, width, xPos, 0, scene);

      if(xPos > this.width - this.getMesh(2).width && height <= this.getMesh(2).height)
         this.getMesh(2).addWindow(height + 1, width, xPos - (this.width - this.getMesh(2).width), 0, scene);

      if(this.getMesh(3) !== undefined && height + yPos < this.getMesh(3).height)
         this.getMesh(3).addWindow(height, width, xPos, 0, scene);
   }
   /* На стену с окнами можно добавить двери, только если они одной высоты и не выше нижней рамки окон.
      Двери добавляются только после окон, но не наоборот */
   addDoor(height, width, xPos, scene){
      this.addWindow(height, width, xPos, 0, scene);
   }
};