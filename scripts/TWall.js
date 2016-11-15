class TWall extends TRigid {
   constructor(height, width, depth, name) {
      super();

      const wall = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth, updateble: true}, map.getScene());
      wall.checkCollisions = this.collision;
      this.name = name;
      wall.material = this.material;
      this.addMesh(wall);
      this.height = height;
      this.width = width;
      this.depth = depth;
      this.rotation = 0;

      this.addMesh( {} );
      
      let gridArr = new Array(Math.floor(height));
      for(let i = 0; i < height; i++)
         gridArr[i] = new Array(Math.floor(width));
      
      for(let i = 0; i < height; i++) {
         for(let j = 0; j < width; j++)
            gridArr[i][j] = 0;
      }

      this.gridArr = gridArr;
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

   getPosition() {
      return {
         x: this.getMesh(0).position.x,
         y: this.getMesh(0).position.y,
         z: this.getMesh(0).position.z
      }
   }

   remove() {
         this.getMesh(0).dispose();
   }

   isFreeSpace(options, xPos, yPos) {
      if(options.width%2 !== 0) { xPos -= 0.5};
      if(options.height%2 !== 0) { yPos -= 0.5};
      
      const doorCheck = (yPos === options.height/2) ? 0 : 1;

      if (xPos < options.width/2  || yPos < options.height/2 + doorCheck || 
         this.width - xPos < options.width/2  || this.height - yPos < options.height/2 ) {
         return false;
      }

      for(let i = this.height - yPos - options.height/2 - 1; i < this.height - yPos + options.height/2 + doorCheck; i++)
         for(let j = xPos - options.width/2 - 1; j < options.width/2 + xPos ; j++)
            if(this.gridArr[i][j])
               return false;
      return true;

   }

   addObject(addingObject, xPos, yPos) {
      
      const currentPosition = this.getPosition();

      const cutout = new TWindow( {name: 'window', height: addingObject.height, width: addingObject.width,
       depth: addingObject.depth, position: addingObject.getObject().position});
      cutout.createObject();
      
      const cutoutPos = addingObject.getObject().position;
      cutout.getObject().position = new BABYLON.Vector3(cutoutPos.x, cutoutPos.y, cutoutPos.z);
      
      cutout.getObject().rotation.y = this.rotation;

      const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getObject());
      const wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));
      const newWall = wallCSG.subtract(cutoutCSG);

      cutout.getObject().dispose();

      this.remove();
      
      const newMeshWall = newWall.toMesh(this.name, this.material, map.getScene());
      newMeshWall.checkCollisions = this.collision;            
      this.meshArr[0] = newMeshWall;

      addingObject.getObject().name = this.name + ':' + addingObject.name;

      this.meshArr[1][addingObject.name] = addingObject;


      addingObject.getObject().rotation.y = this.rotation;

       for(let i = Math.floor(this.height - yPos - addingObject.height/2); i < this.height - yPos + addingObject.height/2; i++)
          for(let j = Math.floor(xPos - addingObject.width/2); j < addingObject.width/2 + xPos; j++)
             this.gridArr[i][j] = 1; 
   }
   
   deleteObject(object) {

      const currentPosition = this.getPosition();

      const cutout = new TWindow( {name: 'window', height: object.height, width: object.width,
       depth: object.depth, position: object.getObject().position});
      cutout.createObject();
      const cutoutPos = object.getObject().position;
      cutout.getObject().position = new BABYLON.Vector3(cutoutPos.x, cutoutPos.y, cutoutPos.z);
      
      cutout.getObject().rotation.y = this.rotation;

      const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getObject());
      const wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));
      const newWall = wallCSG.union(cutoutCSG);


      cutout.getObject().dispose();
      this.remove();

      const newMeshWall = newWall.toMesh(this.name, this.material, map.getScene());
      newMeshWall.checkCollisions = this.collision;            
      this.meshArr[0] = newMeshWall;
   }
};