class TRoom extends TRigid{
   constructor(height, width, length, scene){
      super(scene);

      /* Floor */      
      let ground = new TFloor(length, width, scene);
      let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
      groundMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      ground.setMaterial(groundMaterial);
      this.ground = ground;

      /* Back wall */
      let back = new TWall(height, ground.width, scene);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.85, 1);
      back.rotateY(Math.PI);
      this.back = back;

      /* Front wall */
      let front = new TWall(height, ground.width, scene);
      this.front = front;

      /* Right wall */
      let right = new TWall(back.height, ground.height, scene);
      right.rotateY(Math.PI/2);
      this.right = right;

      /* Left wall */
      let left = new TWall(back.height, ground.height, scene);
      left.rotateY(-Math.PI/2);      
      this.left = left;

      /* Ceiling */
      let top = new TCeiling(ground.height, ground.width, scene);
      this.top = top;

      this.setPosition(0, 0, 0);
      this.setWallMaterial(wallMaterial);
   }
   setPosition(x, y , z){
      this.ground.setPosition(x, y, z);
      this.back.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height/2, this.ground.getPosition().z - this.ground.height/2);
      this.front.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.front.height/2, this.ground.getPosition().z + this.ground.height/2); 
      this.right.setPosition(this.ground.getPosition().x + this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z + this.right.width/2);
      this.left.setPosition(this.ground.getPosition().x - this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z + this.left.width/2);
      this.top.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height, this.ground.getPosition().z);
   }
   setWallMaterial(material){
      this.left.setMaterial(material);
      this.right.setMaterial(material);
      this.front.setMaterial(material);
      this.back.setMaterial(material);
   }
   getFloor(){
      return this.ground;
   }
   getCeiling(){
      return this.top;
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
};