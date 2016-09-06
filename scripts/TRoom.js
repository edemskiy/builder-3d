class TRoom extends TRigid{
   constructor(height, width, length, name, scene){
      super(scene);
      this.name = name;

      

      /* Floor */      
      let floor = new TFloor(length, width, name + ":floor", scene);
      let floorMaterial = new BABYLON.StandardMaterial("floorMaterial", scene);
      floorMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      //floorMaterial.diffuseTexture = new BABYLON.Texture("textures/floor.jpg", scene);
      floor.setMaterial(floorMaterial);
      this.floor = floor;

      /* Back wall */
      let backWall = new TWall(height, floor.width, name + ":backWall", scene);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.85, 1);
      //wallMaterial.diffuseTexture = new BABYLON.Texture("textures/wall.jpg", scene);
      this.backWall = backWall;

      /* Front wall */
      let frontWall = new TWall(height, floor.width, name + ":frontWall", scene);
      this.frontWall = frontWall;

      /* Right wall */
      let rightWall = new TWall(backWall.height, floor.height, name + ":rightWall", scene);
      rightWall.rotateY(-Math.PI/2);
      this.rightWall = rightWall;

      /* Left wall */
      let leftWall = new TWall(backWall.height, floor.height, name + ":leftWall", scene);
      leftWall.rotateY(-Math.PI/2);      
      this.leftWall = leftWall;

      /* Ceiling */
      let ceiling = new TCeiling(floor.height, floor.width, name + ":ceiling", scene);
      this.ceiling = ceiling;

      this.setPosition(0, 0, 0);
      this.setWallMaterial(wallMaterial);

      this.meshArr[0] = {
         "floor": this.floor,
         "frontWall": this.frontWall,
         "rightWall": this.rightWall,
         "backWall": this.backWall,
         "leftWall": this.leftWall,
         "ceiling": ceiling
      };
   }
   setPosition(x, y , z){
      this.floor.setPosition(x, y, z);
      this.backWall.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.backWall.height/2, this.floor.getPosition().z - this.floor.height/2);
      this.frontWall.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.frontWall.height/2, this.floor.getPosition().z + this.floor.height/2); 
      this.rightWall.setPosition(this.floor.getPosition().x + this.floor.width/2, this.floor.getPosition().y + this.backWall.height/2, this.backWall.getPosition().z + this.rightWall.width/2);
      this.leftWall.setPosition(this.floor.getPosition().x - this.floor.width/2, this.floor.getPosition().y + this.backWall.height/2, this.backWall.getPosition().z + this.leftWall.width/2);
      this.ceiling.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.backWall.height, this.floor.getPosition().z);
   }
   setWallMaterial(material){
      this.leftWall.setMaterial(material);
      this.rightWall.setMaterial(material);
      this.frontWall.setMaterial(material);
      this.backWall.setMaterial(material);
   }
   getFloor(){
      return this.floor;
   }
   getCeiling(){
      return this.ceiling;
   }
   getLeftWall(){
      return this.leftWall;
   }
   getRightWall(){
      return this.rightWall;
   }
   getFrontWall(){
      return this.frontWall;
   }
   getBackWall(){
      return this.backWall;
   }
   getName(){
      return this.name;
   }
};