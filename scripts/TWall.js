class TWall extends TRigid{
   constructor(height, width, depth, name, scene){
      super(scene);
      this.scene = scene;
      let wall = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth, updateble: true}, this.scene);
      wall.checkCollisions = this.collision;
      this.name = name;
      this.addMesh(wall);
      this.height = height;
      this.width = width;
      this.depth = depth;
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
   addObject(addingObject, xPos, yPos){
      
      if(addingObject.width%2 !== 0){ xPos -= 0.5};
      if(addingObject.height%2 !== 0){ yPos -= 0.5};
      
      let doorCheck = (yPos === addingObject.height/2) ? 0 : 1;

      if (xPos < addingObject.width/2 + 1 || yPos < addingObject.height/2 + doorCheck || 
         this.width - xPos < addingObject.width/2 + 1 || this.height - yPos < addingObject.height/2 + 1) {
         return;
      }

      for(let i = this.height - yPos - addingObject.height/2 - 1; i < this.height - yPos + addingObject.height/2 + doorCheck; i++)
         for(let j = xPos - addingObject.width/2 - 1; j < addingObject.width/2 + xPos + 1; j++)
            if(this.gridArr[i][j])
               return;

      let currentPosition = this.getPosition();

      /* Поворот для предотвращения изменения освещения */
      this.getMesh(0).rotation.y = 0;
      /* ----------------- ??? ----------------- */

      addingObject.createObject();
      addingObject.getObject().position = new BABYLON.Vector3(currentPosition.x - this.width/2 + xPos,
         currentPosition.y - this.height/2  + yPos,
         currentPosition.z);

      let addingObjectCSG = BABYLON.CSG.FromMesh(addingObject.getObject());
      let wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));
      let newWall = wallCSG.subtract(addingObjectCSG);

      switch(addingObject.addingMode){
         case "difference": 
            addingObject.getObject().dispose();
            break;
         case "union":            
            break;
      }

      this.remove();
      
      this.meshArr.shift();
      let newMeshWall = newWall.toMesh(this.name, this.material, this.scene);
      newMeshWall.checkCollisions = this.collision;
      this.addMesh(newMeshWall);

      /* Обратный разворот */
      this.rotateY(this.rotation);
      addingObject.getObject().position = new BABYLON.Vector3(currentPosition.x - (this.width/2 - xPos)*Math.cos(-this.rotation),
        currentPosition.y - this.height/2 + yPos,
        currentPosition.z - (this.width/2  - xPos)*Math.sin(-this.rotation));
      addingObject.getObject().rotation.y = this.rotation;
      /* ------------------------------ ??? ------------------------------------ */

      for(let i = this.height - yPos - addingObject.height/2; i < this.height - yPos + addingObject.height/2; i++)
         for(let j = xPos - addingObject.width/2; j < addingObject.width/2 + xPos; j++)
            this.gridArr[i][j] = 1;

      
   }
};