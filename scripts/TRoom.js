class TRoom extends TRigid{
   constructor(height, width, length, scene){
      super(scene);

      /* Пол */      
      let ground = new TFloor(length, width, scene);
      let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
      groundMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      ground.setMaterial(groundMaterial);
      this.ground = ground;

      /* Задняя стенка */
      let back = new TWall(height, ground.width, scene);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.5);
      back.rotateY(Math.PI);
      back.setMaterial(wallMaterial);
      this.back = back;

      /* Передняя стенка */
      let front = new TWall(height, ground.width, scene);
      front.setMaterial(wallMaterial);
      this.front = front;

      /* Правая стенка */
      let right = new TWall(back.height, ground.height, scene);
      right.rotateY(Math.PI/2);
      right.setMaterial(wallMaterial);
      this.right = right;

      /* Левая стенка */
      let left = new TWall(back.height, ground.height, scene);
      left.rotateY(-Math.PI/2);
      left.setMaterial(wallMaterial);
      this.left = left;

      /* Потолок */
      let top = new TCeiling(ground.height, ground.width, scene);
      top.setMaterial(groundMaterial);
      this.top = top;

      this.setPosition(0, 0, 0);
   }
   setPosition(x, y , z){
      this.ground.setPosition(x, y, z);
      this.back.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height/2, this.ground.getPosition().z - this.ground.height/2);
      this.front.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.front.height/2, this.ground.getPosition().z + this.ground.height/2); 
      this.right.setPosition(this.ground.getPosition().x + this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z + this.right.width/2);
      this.left.setPosition(this.ground.getPosition().x - this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z + this.left.width/2);
      this.top.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height, this.ground.getPosition().z);
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