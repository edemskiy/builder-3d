class TWall extends TRigid{
   constructor(height, width, name, scene){
      super(scene);
      let wall = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: 0.5, updateble: true}, scene);
      wall.checkCollisions = this.collision;
      this.name = name;
      this.addMesh(wall);
      this.height = height;
      this.width = width;
      this.rotation = 0;
      
      let gridArr = new Array(Math.floor(height));
      for(let i = 0; i < height; i++)
         gridArr[i] = new Array(Math.floor(width));
      
      for(let i = 0; i < height; i++) {
         for(let j = 0; j < width; j++)
            gridArr[i][j] = 0;
      }
      this.gridArr = gridArr;
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
   addWindow(height, width, xPos, yPos, scene){
      let currentPosition = this.getPosition();
      if(width%2 !== 0){ xPos -= 0.5};
      if(height%2 !== 0){ yPos -= 0.5};
      
      let doorCheck = 1;
      if(yPos === height/2){ doorCheck = 0}; 

      if (xPos < width/2 + 1 || yPos < height/2 + doorCheck || this.width - xPos < width/2 + 1 || this.height - yPos < height/2 + 1) {
         return;
      }

      for(let i = this.height - yPos - height/2 - 1; i < this.height - yPos + height/2 + doorCheck; i++)
         for(let j = xPos - width/2 - 1; j < width/2 + xPos + 1; j++)
            if(this.gridArr[i][j])
               return;
      
      this.getMesh(0).rotation.y = 0;
      let window = BABYLON.MeshBuilder.CreateBox("window", {height: height, width: width, depth: 0.5}, scene);
      
      window.position = new BABYLON.Vector3(currentPosition.x - this.width/2 + xPos,
         currentPosition.y - this.height/2  + yPos,
         currentPosition.z);

      let windowCSG = BABYLON.CSG.FromMesh(window);
      let wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));

      let newWall = wallCSG.subtract(windowCSG);
      
      this.remove();
      window.dispose();
      window = null;
      
      this.meshArr.shift();
      let newMeshWall = newWall.toMesh(this.name, this.material, scene);
      newMeshWall.checkCollisions = this.collision;
      this.addMesh(newMeshWall);

      this.rotateY(this.rotation);
      for(let i = this.height - yPos - height/2; i < this.height - yPos + height/2; i++)
         for(let j = xPos - width/2; j < width/2 + xPos; j++)
            this.gridArr[i][j] = 1;

      
   }
   addDoor(height, width, xPos, scene){
      this.addWindow(height, width, xPos, height/2, scene);
   }
};