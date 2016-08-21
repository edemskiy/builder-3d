class TRoom extends TRigid{
   constructor(height, width, length, name, scene){
      super(scene);
      this.name = name;

      /* Floor */      
      let floor = new TFloor(length, width, name + ":floor", scene);
      let floorMaterial = new BABYLON.StandardMaterial("floorMaterial", scene);
      floorMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      floor.setMaterial(floorMaterial);
      this.floor = floor;

      /* Back wall */
      let back = new TWall(height, floor.width, name + ":back", scene);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.85, 1);
      //back.rotateY(Math.PI);
      this.back = back;

      /* Front wall */
      let front = new TWall(height, floor.width, name + ":front", scene);
      this.front = front;

      /* Right wall */
      let right = new TWall(back.height, floor.height, name + ":right", scene);
      right.rotateY(Math.PI/2);
      this.right = right;

      /* Left wall */
      let left = new TWall(back.height, floor.height, name + ":left", scene);
      left.rotateY(Math.PI/2);      
      this.left = left;

      /* Ceiling */
      let ceiling = new TCeiling(floor.height, floor.width, name + ":ceiling", scene);
      this.ceiling = ceiling;

      this.setPosition(0, 0, 0);
      this.setWallMaterial(wallMaterial);

      this.meshArr[0] = {
         "floor": this.floor,
         "front": this.front,
         "right": this.right,
         "back": this.back,
         "left": this.left,
         "ceiling": ceiling
      };
   }
   setPosition(x, y , z){
      this.floor.setPosition(x, y, z);
      this.back.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.back.height/2, this.floor.getPosition().z - this.floor.height/2);
      this.front.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.front.height/2, this.floor.getPosition().z + this.floor.height/2); 
      this.right.setPosition(this.floor.getPosition().x + this.floor.width/2, this.floor.getPosition().y + this.back.height/2, this.back.getPosition().z + this.right.width/2);
      this.left.setPosition(this.floor.getPosition().x - this.floor.width/2, this.floor.getPosition().y + this.back.height/2, this.back.getPosition().z + this.left.width/2);
      this.ceiling.setPosition(this.floor.getPosition().x, this.floor.getPosition().y + this.back.height, this.floor.getPosition().z);
   }
   setWallMaterial(material){
      this.left.setMaterial(material);
      this.right.setMaterial(material);
      this.front.setMaterial(material);
      this.back.setMaterial(material);
   }
   getFloor(){
      return this.floor;
   }
   getCeiling(){
      return this.ceiling;
   }
   getLeftWall(){
      return this.left;
   }
   getRightWall(){
      return this.right;
   }
   getFrontWall(){
      return this.front;
   }
   getBackWall(){
      return this.back;
   }
   getName(){
      return this.name;
   }
};