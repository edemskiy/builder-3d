class TObject{
   constructor(){
      this.meshArr = [];
   }
   getBabylon(){
      return this.meshArr;
   }
};

class TRigid extends TObject{
   constructor(scene){
      super();
      let material = new BABYLON.StandardMaterial("material", scene);
      this.material = material;
      this.collision = true;
   }
   setMaterial(material){
      for(let i = 0; i < this.meshArr.length; i++){
         this.meshArr[i].material = this.material = material;
      }
   }
};

class TStairs extends TRigid{
   constructor(height, width, length, stairsNum, scene){
      super(scene);
      let stairHeight = height/stairsNum;
      let stairLength = length/stairsNum;
      for(let i = 0; i < stairsNum; i++){
         let tmp = new BABYLON.Mesh.CreateBox("stair" + i, stairHeight, scene);
         tmp.scaling.x = width/stairHeight;
         tmp.scaling.z = stairLength/stairHeight;
         tmp.position = new BABYLON.Vector3(0, i*stairHeight, i*stairLength);
         tmp.checkCollisions = this.collision;
         this.meshArr[i] = tmp;
      }
      this.stairsNum = stairsNum;
      this.stairHeight = stairHeight;
      this.stairLength = stairLength;
      this.length = length;
      this.height = height;
      this.width = width;
   }
   setPosition(x,y,z){
      for(let i = 0; i < this.stairsNum; i++){
         this.meshArr[i].position = new BABYLON.Vector3(x, y + i*this.stairHeight, z + i*this.stairLength);
      }
   }
   rotateY(alpha){
      for(let i = 0; i < this.stairsNum; i++){
         this.meshArr[i].rotation.y = alpha;
         let currPos = this.meshArr[i].getPositionExpressedInLocalSpace();
         this.meshArr[i].position = new BABYLON.Vector3(currPos.x + i*this.stairLength*Math.sin(alpha), currPos.y,
            this.meshArr[0].getPositionExpressedInLocalSpace().z + i*this.stairLength*Math.cos(alpha));
      }
   }
};

class TWall extends TRigid{
   constructor(height,width,scene){
      super(scene);
      let wall = new BABYLON.Mesh.CreatePlane("wall", height, scene);
      wall.scaling.x = width/height;
      wall.checkCollisions = this.collision;
      this.meshArr[0] = wall;
      this.meshArr[0].size = height;
      this.height = height;
      this.width = width;
      this.rotation = 0;
   }
   setPosition(x, y, z){
      if(this.meshArr.length === 1){
         this.meshArr[0].position = new BABYLON.Vector3(x,y,z);
      }
   }
   rotateY(alpha){
      this.meshArr[0].rotation.y = alpha;
      this.rotation = alpha;
   }
   setSize(height, width){
      this.meshArr[0].scaling.y = height/this.meshArr[0].size;
      this.meshArr[0].scaling.x = width/this.meshArr[0].size;
   }
   getPosition(){
      return {
         x: this.meshArr[0].position.x,
         y: this.meshArr[0].position.y,
         z: this.meshArr[0].position.z
      }
   }
   addDoor(height, width, from, scene){
      this.setSize(this.height - height, this.width);
      let currPos = this.getPosition();
      this.setPosition(currPos.x, currPos.y + height/2, currPos.z);
      
      let leftWall = new BABYLON.Mesh.CreatePlane("leftWall", height, scene);
      leftWall.scaling.x = from/height;
      leftWall.rotation.y = this.rotation;

      let rightWall = new BABYLON.Mesh.CreatePlane("rightWall", height, scene);
      rightWall.width = this.width - from - width;
      rightWall.scaling.x = rightWall.width/height;
      rightWall.rotation.y = this.rotation;

      leftWall.position = new BABYLON.Vector3(currPos.x - Math.cos(this.rotation) * (this.width/2 - from/2), 
         currPos.y - this.height/2 + height/2,
         currPos.z - Math.sin(this.rotation) * (this.width/2 - from/2));
      
      rightWall.position = new BABYLON.Vector3(leftWall.position.x + (from/2 + width + rightWall.width/2) * Math.cos(this.rotation), //position.x
         currPos.y - this.height/2 + height/2, // position.y
         leftWall.position.z + (from/2 + width + rightWall.width/2) * Math.sin(this.rotation)); // position.z

      leftWall.material = rightWall.material = this.material;

      leftWall.checkCollisions = rightWall.checkCollisions = this.collision;

      this.meshArr.push(leftWall);
      this.meshArr.push(rightWall);
      console.log(this);
   }
}
class TFloor extends TWall{
   constructor(height, width, scene){
      super(height, width, scene);
      this.meshArr[0].rotation.x = Math.PI/2;
   }
}
class TCeiling extends TWall{
   constructor(height, width, scene){
      super(height, width, scene);
      this.meshArr[0].rotation.x = -Math.PI/2;
   }
}
class TRoom extends TRigid{
   constructor(height, width, length, scene){
      super(scene);


      /* Пол */      
      let ground = new TFloor(length, width, scene);
      let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
      groundMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      ground.setMaterial(groundMaterial);
      this.ground = ground;

      /* Передняя стенка */
      let back = new TWall(height, ground.width, scene);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.5);
      back.setMaterial(wallMaterial);
      this.back = back;

      /* Задняя стенка */
      let front = new TWall(height, ground.width, scene);
      front.rotateY(Math.PI);
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

      /*
      let light1 = new BABYLON.SpotLight("light1", new BABYLON.Vector3(20, 25, -35), new BABYLON.Vector3(-40, -25, 70), Math.PI, 20, scene);
      let light2 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(-20, 25, 35), new BABYLON.Vector3(40, -25, -70), Math.PI, 20, scene);
      let light3 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(-20, 25, -35), new BABYLON.Vector3(40, -25, 70), Math.PI, 20, scene);
      let light4 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(20, 25, 35), new BABYLON.Vector3(-40, -25, -70), Math.PI, 20, scene);
      */
   }
   setPosition(x, y , z){
      this.ground.setPosition(x, y, z);
      this.back.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height/2, this.ground.getPosition().z + this.ground.height/2);
      this.front.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.front.height/2, this.ground.getPosition().z - this.ground.height/2); 
      this.right.setPosition(this.ground.getPosition().x + this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z - this.right.width/2);
      this.left.setPosition(this.ground.getPosition().x - this.ground.width/2, this.ground.getPosition().y + this.back.height/2, this.back.getPosition().z - this.left.width/2);
      this.top.setPosition(this.ground.getPosition().x, this.ground.getPosition().y + this.back.height, this.ground.getPosition().z);
   }

}

class Scene {
   constructor (engine){
      let scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -2, 0); 
      this.scene = scene;
      
      let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 5, -20), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, false);
      camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      camera.checkCollisions = true;
      camera.applyGravity = true;
      this.camera = camera;

      /* Свет */
      let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -1), scene);
      light1.intensity = .75;

      let room1 = new TRoom(25, 40, 70, scene);
      let room2 = new TRoom(25, 50, 30, scene);
      room2.setPosition(-45, 0, -20);
      room1.left.addDoor(10, 7, 50, scene);
      room2.right.addDoor(10, 7, 13, scene);

      let secFloor = new TFloor(room1.ground.height/3, room1.ground.width/4, scene);
      secFloor.setPosition(-secFloor.width*1.5, room1.back.height/4, secFloor.height);
      this.secFloor = secFloor;

      /* Лестница */
      //Params for stairs: height, width, length, stairsNum, scene
      let stairs1 = new TStairs(secFloor.getPosition().y, secFloor.width, secFloor.height/2, 15, this.scene);
      let stairsMaterial = new BABYLON.StandardMaterial("stairsMaterial", this.scene);
      stairsMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.8, 0.7);
      stairs1.setMaterial(stairsMaterial);
      stairs1.setPosition(secFloor.getPosition().x, stairs1.stairHeight/2, secFloor.height/2 - stairs1.length + stairs1.stairLength/2);
      stairs1.rotateY(0);
      this.stairs1 = stairs1;

      let thirdFloor = new TFloor(room1.ground.height/2, room1.ground.width/4, scene);
      thirdFloor.setPosition(thirdFloor.width*1.5, room1.back.height*0.6, thirdFloor.height/2);
      this.thirdFloor = thirdFloor;

      let stairs2 = new TStairs(thirdFloor.getPosition().y - secFloor.getPosition().y, thirdFloor.width, 
         Math.abs(thirdFloor.getPosition().x - thirdFloor.width/2 - secFloor.getPosition().x - secFloor.width/2), 15, this.scene);
      stairs2.setMaterial(stairsMaterial);
      stairs2.setPosition(secFloor.getPosition().x + secFloor.width/2 + stairs2.stairLength/2, secFloor.getPosition().y + stairs2.stairHeight/2,
       room1.back.getPosition().z - stairs2.width/2);
      stairs2.rotateY(Math.PI/2);
      this.stairs2 = stairs2;
   }
   getScene(){
      return this.scene;
   }
}

class Map {
   constructor(canvas){
      this.canvas = canvas;
      this.engine = new BABYLON.Engine(canvas, true);
      this.scene = new Scene(this.engine).getScene();
      window.addEventListener("resize", () => {
            this.engine.resize();
         });
   }
   runRenderLoop() {
      this.engine.runRenderLoop(() => {
         this.scene.render();
      });
   }
}