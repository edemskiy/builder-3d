class TWall extends TRigid {
   constructor(options) {
      super();
      this.args = options;
      const height = options.height, width = options.width, depth = options.depth, name = options.name;
      const wall = BABYLON.MeshBuilder.CreateBox(name, {height: height, width: width, depth: depth, updateble: true}, map.getScene());
      wall.checkCollisions = this.collision;
      this.name = name;
      
      this.height = height;
      this.width = width;
      this.depth = depth;
      this.rotation = 0;

      let multi = new BABYLON.MultiMaterial(name + "Material",map.getScene());

      multi.subMaterials.push(new BABYLON.StandardMaterial(name + "BackMaterial", map.getScene()));
      multi.subMaterials.push(new BABYLON.StandardMaterial(name + "FrontMaterial", map.getScene()));
      
      wall.subMeshes=[];
      let verticesCount=wall.getTotalVertices();
      wall.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, wall));
      wall.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, wall));
      wall.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, wall));
      wall.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, wall));
      wall.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, wall));
      wall.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, wall));
      wall.material = multi;
      this.material = multi;

      wall.getObject = () => this;
      
      this.addMesh(wall);
      this.addMesh( {} );

      let gridArr = new Array(Math.floor(height));
      for(let i = 0; i < height; i++)
         gridArr[i] = new Array(Math.floor(width));
      
      for(let i = 0; i < height; i++) {
         for(let j = 0; j < width; j++)
            gridArr[i][j] = 0;
      }

      this.CSGWall = BABYLON.CSG.FromMesh(this.getMesh());

      this.gridArr = gridArr;

   }

   setPosition(x, y, z) {
         super.setPosition(x,y,z);
         this.CSGWall = BABYLON.CSG.FromMesh(this.getMesh());
   }

   rotateY(alpha){
      alpha = alpha % (2*Math.PI);
      this.getMesh().rotation.y = alpha;
      this.rotation = alpha;

      for(let key in this.getMesh(1)){
         this.getMesh(1)[key].rotateAroundPoint(this.getPosition(), alpha);
      }
      this.CSGWall = BABYLON.CSG.FromMesh(this.getMesh());
   }

   setMaterial(material) {

      this.getMesh().material.subMaterials[0] = material;
      this.getMesh().material.subMaterials[1] = material;
      this.material = material;
   }

   setTexture(name) {
      this.material.subMaterials[0].diffuseTexture = new BABYLON.Texture(name, map.getScene());
      this.material.subMaterials[1].diffuseTexture = new BABYLON.Texture(name, map.getScene());
   }

   setFrontTexture(name) {
      this.material.subMaterials[1].diffuseTexture = new BABYLON.Texture(name, map.getScene());
   }

   setBackTexture(name) {
      this.material.subMaterials[0].diffuseTexture = new BABYLON.Texture(name, map.getScene());
   }

   getDistanceFromLeft(pickedPoint){
      const currentPosition = this.getPosition();

      const c = this.width/2;
      const alpha = -this.getRotationY();
      const wallLeftPoint = new BABYLON.Vector3(
         currentPosition.x - c * Math.cos(alpha),
         currentPosition.y,
         currentPosition.z - c * Math.sin(alpha)
         );

      const xPosition = Math.floor(Math.sqrt((wallLeftPoint.x - pickedPoint.x)*(wallLeftPoint.x - pickedPoint.x) +
         (wallLeftPoint.z - pickedPoint.z)*(wallLeftPoint.z - pickedPoint.z)));

      const objPosition = new BABYLON.Vector3(
         wallLeftPoint.x + xPosition * Math.cos(alpha),
         pickedPoint.y,
         wallLeftPoint.z + xPosition * Math.sin(alpha)
         );
      return {objPosition, xPosition};
   }

   isFreeSpace(options, xPos, yPos) {
      
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
       depth: addingObject.depth, position: addingObject.getMesh().position});
      cutout.createObject();
      
      const cutoutPos = addingObject.getMesh().position;
      cutout.getMesh().position = new BABYLON.Vector3(cutoutPos.x, cutoutPos.y, cutoutPos.z);
      
      cutout.getMesh().rotation.y = this.rotation;

      cutout.getMesh().material = this.material;

      const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getMesh());
      const wallCSG = BABYLON.CSG.FromMesh(this.getMesh());
      wallCSG.subtractInPlace(cutoutCSG);      

      cutout.getMesh().dispose();

      this.remove();
      
      const newMeshWall = wallCSG.toMesh(this.name, this.material, map.getScene());
      newMeshWall.rotation.y = this.rotation;

      newMeshWall.material = this.material;      
      newMeshWall.checkCollisions = this.collision;
      newMeshWall.getObject = () => this;

      this.meshArr[0] = newMeshWall;

      addingObject.getMesh().name = this.name + ':' + addingObject.name;

      this.meshArr[1][addingObject.name] = addingObject;


      addingObject.getMesh().rotation.y = this.rotation;
      addingObject.getMesh().getContainingWall = () => this;

      for(let i = Math.floor(this.height - yPos - addingObject.height/2); i < Math.floor(this.height - yPos + addingObject.height/2); i++)
        for(let j = Math.floor(xPos - addingObject.width/2); j < Math.floor(addingObject.width/2 + xPos); j++)
         this.gridArr[i][j] = 1;
   }
   
   deleteObject(object) {

      const currentPosition = this.getPosition();

      const cutout = new TWindow( {name: 'window', height: object.height, width: object.width, depth: object.depth, position: object.getMesh().position});
      cutout.createObject();

      const cutoutPos = object.getMesh().position;
      
      cutout.getMesh().position = new BABYLON.Vector3(cutoutPos.x, cutoutPos.y, cutoutPos.z);
      cutout.getMesh().rotation.y = this.rotation;

      const solidWallCSG = this.CSGWall.clone();
      const cutoutCSG = BABYLON.CSG.FromMesh(cutout.getMesh());
      const wallCSG = BABYLON.CSG.FromMesh(this.getMesh());
      let newWallCSG = wallCSG.union(cutoutCSG);
      
      newWallCSG = solidWallCSG.subtract(newWallCSG);
      solidWallCSG.subtractInPlace(newWallCSG);

      cutout.getMesh().dispose();
      this.remove();

      const newMeshWall = solidWallCSG.toMesh(this.name, this.material, map.getScene());
      newMeshWall.checkCollisions = this.collision;
      newMeshWall.getObject = () => this;
      this.meshArr[0] = newMeshWall;

      const c = this.width/2;
      const alpha = -this.getRotationY();
      const wallLeftPoint = new BABYLON.Vector3(
         currentPosition.x - c * Math.cos(alpha),
         currentPosition.y,
         currentPosition.z - c * Math.sin(alpha)
         );

      const xPos = Math.sqrt((wallLeftPoint.x - cutoutPos.x) ** 2 + (wallLeftPoint.z - cutoutPos.z) ** 2);
      const yPos = cutoutPos.y;

      for(let i = Math.floor(this.height - yPos - object.height/2); i < Math.floor(this.height - yPos + object.height/2); i++)
          for(let j = Math.floor(xPos - object.width/2); j < Math.floor(object.width/2 + xPos); j++)
             this.gridArr[i][j] = 0;
   }
};