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
   addWindow(height, width, xPos, yPos, scene){
      let freeSpace = 0;
      let currPos = this.getPosition();

      for(let i = this.height - yPos - height; i < this.height - yPos; i++)
         for(let j = xPos; j < width + xPos; j++)
            if(this.gridArr[i][j])
               return;
      
      let window = BABYLON.MeshBuilder.CreateBox("window", {height: height, width: width, depth: 0.5}, scene);
      window.rotation.y = this.rotation;

      window.position = new BABYLON.Vector3(currPos.x - (this.width/2 - width/2 - xPos)*Math.cos(-this.rotation),
         currPos.y - this.height/2 + height/2 + yPos,
         currPos.z - (this.width/2 - width/2 - xPos)*Math.sin(-this.rotation));

      let windowCSG = BABYLON.CSG.FromMesh(window);
      let wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));

      let newWall = wallCSG.subtract(windowCSG);
      
      this.remove();
      window.dispose();
      window = null;
      
      this.meshArr.pop();
      let newMeshWall = newWall.toMesh("wall", this.material, scene);
      newMeshWall.checkCollisions = this.collision;
      this.addMesh(newMeshWall);

      for(let i = this.height - yPos - height; i < this.height - yPos; i++)
         for(let j = xPos; j < width + xPos; j++)
            this.gridArr[i][j] = 1;
   }
   addDoor(height, width, xPos, scene){
      this.addWindow(height, width, xPos, 0, scene);
   }
};