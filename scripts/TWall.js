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
   getDistanceFromLeft(pickedPoint){
      const currentPosition = this.getPosition();

      const c = this.width/2;
      const alpha = -this.getRotationY();
      const wallLeftPoint = {
         x: currentPosition.x - c * Math.cos(alpha),
         y: currentPosition.y,
         z: currentPosition.z - c * Math.sin(alpha)
      }

      const xPosition = Math.floor(Math.sqrt((wallLeftPoint.x - pickedPoint.x)*(wallLeftPoint.x - pickedPoint.x) +
         (wallLeftPoint.z - pickedPoint.z)*(wallLeftPoint.z - pickedPoint.z)));

      const objPosition = {
         x: Math.floor(wallLeftPoint.x + xPosition * Math.cos(alpha)),
         y: Math.floor(pickedPoint.y),
         z: Math.floor(wallLeftPoint.z + xPosition * Math.sin(alpha))
      };
      return {objPosition, xPosition};
   }

   isFreeSpace(options, xPos, yPos) {
      //if(options.width%2 !== 0) { xPos -= 0.5};
      //if(options.height%2 !== 0) { yPos -= 0.5};
      
      //const doorCheck = (yPos === options.height/2) ? 0 : 1;

      if (xPos < options.width/2  || yPos <= options.height/2 || 
         this.width - xPos < options.width/2  || this.height - yPos <= options.height/2 ) {
         return false;
      }

      for(let i = Math.floor(this.height - yPos - options.height/2); i < this.height - yPos + options.height/2; i++)
         for(let j = Math.floor(xPos - options.width/2); j < options.width/2 + xPos ; j++)
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

      for(let i = Math.floor(this.height - yPos - addingObject.height/2); i < Math.floor(this.height - yPos + addingObject.height/2); i++)
        for(let j = Math.floor(xPos - addingObject.width/2); j < Math.floor(addingObject.width/2 + xPos); j++)
           this.gridArr[i][j] = 1;
   }
   
   deleteObject(object) {

      const currentPosition = this.getPosition();

      const solidWall = BABYLON.MeshBuilder.CreateBox(this.name, {height: this.height, width: this.width, depth: this.depth, updateble: true}, map.getScene());
      solidWall.position = new BABYLON.Vector3(currentPosition.x, currentPosition.y, currentPosition.z);
      solidWall.rotation.y = this.rotation;

      const cutout = new TWindow( {name: 'window', height: object.height, width: object.width, depth: object.depth, position: object.getObject().position});
      cutout.createObject();

      const cutoutPos = object.getObject().position;
      
      cutout.getObject().position = new BABYLON.Vector3(cutoutPos.x, cutoutPos.y, cutoutPos.z);
      cutout.getObject().rotation.y = this.rotation;

      const solidWallCSG = BABYLON.CSG.FromMesh(solidWall);
      const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getObject());
      const wallCSG = BABYLON.CSG.FromMesh(this.getMesh(0));
      let newWallCSG = wallCSG.union(cutoutCSG);
      
      newWallCSG = solidWallCSG.subtract(newWallCSG);
      solidWallCSG.subtractInPlace(newWallCSG);

      cutout.getObject().dispose();
      this.remove();
      solidWall.dispose();

      const newMeshWall = solidWallCSG.toMesh(this.name, this.material, map.getScene());      
      newMeshWall.checkCollisions = this.collision;            
      this.meshArr[0] = newMeshWall;

      const c = this.width/2;
      const alpha = -this.getRotationY();
      const wallLeftPoint = {
         x: currentPosition.x - c * Math.cos(alpha),
         y: currentPosition.y,
         z: currentPosition.z - c * Math.sin(alpha)
      }

      const xPos = Math.floor(Math.sqrt((wallLeftPoint.x - cutoutPos.x)*(wallLeftPoint.x - cutoutPos.x) +
         (wallLeftPoint.z - cutoutPos.z)*(wallLeftPoint.z - cutoutPos.z)));

      const yPos = Math.floor(cutoutPos.y);

      for(let i = Math.floor(this.height - yPos - object.height/2); i < Math.floor(this.height - yPos + object.height/2); i++)
          for(let j = Math.floor(xPos - object.width/2); j < Math.floor(object.width/2 + xPos); j++)
             this.gridArr[i][j] = 0;
   }
};