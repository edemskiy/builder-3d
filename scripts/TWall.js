class TWall extends TRigid{
   constructor(height, width, depth, name){
      super();

      let wall = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth, updateble: true}, map.getScene());
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
   isFreeSpace(options, xPos, yPos){

      if(options.width%2 !== 0){ xPos -= 0.5};
      if(options.height%2 !== 0){ yPos -= 0.5};
      
      let doorCheck = (yPos === options.height/2) ? 0 : 1;

      if (xPos < options.width/2 + 1 || yPos < options.height/2 + doorCheck || 
         this.width - xPos < options.width/2 + 1 || this.height - yPos < options.height/2 + 1) {
         return false;
      }

      for(let i = this.height - yPos - options.height/2 - 1; i < this.height - yPos + options.height/2 + doorCheck; i++)
         for(let j = xPos - options.width/2 - 1; j < options.width/2 + xPos + 1; j++)
            if(this.gridArr[i][j])
               return false;
      return true;

   }
   addObject(addingObject, xPos, yPos){
      
      if(addingObject.width%2 !== 0){ xPos -= 0.5};
      if(addingObject.height%2 !== 0){ yPos -= 0.5};
            
      let currentPosition = this.getPosition();

      /* Поворот для предотвращения изменения освещения */
      this.getMesh(0).rotation.y = 0;
      /* ----------------- ??? ----------------- */

      addingObject.getObject().position = new BABYLON.Vector3(currentPosition.x - this.width/2 + xPos,
         currentPosition.y - this.height/2  + yPos,
         currentPosition.z);

      let cutout = new TWindow({name: "window", height: addingObject.height, width: addingObject.width,
       depth: addingObject.depth, position: addingObject.getObject().position});
      cutout.createObject();
      cutout.getObject().position = addingObject.getObject().position;

      let cutoutCSG = BABYLON.CSG.FromMesh(cutout.getObject());
      let wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));
      let newWall = wallCSG.subtract(cutoutCSG);

      cutout.getObject().dispose();

      this.remove();
      
      this.meshArr.shift();
      let newMeshWall = newWall.toMesh(this.name, this.material, map.getScene());
      newMeshWall.checkCollisions = this.collision;
      this.addMesh(newMeshWall);

      /* Обратный разворот */
      this.rotateY(this.rotation);
      addingObject.getObject().position = new BABYLON.Vector3(currentPosition.x - (this.width/2 - xPos)*Math.cos(this.rotation),
        currentPosition.y - this.height/2 + yPos,
        currentPosition.z + (this.width/2  - xPos)*Math.sin(this.rotation));
      addingObject.getObject().rotation.y = this.rotation;
      /* ------------------------------ ??? ------------------------------------ */

      for(let i = this.height - yPos - addingObject.height/2; i < this.height - yPos + addingObject.height/2; i++)
         for(let j = xPos - addingObject.width/2; j < addingObject.width/2 + xPos; j++)
            this.gridArr[i][j] = 1;      
   }
};