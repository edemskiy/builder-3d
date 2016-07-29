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
         this.meshArr[i].material = material;
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
      this.height = height;
      this.width = width;
   }
   setPosition(x, y, z){
      if(this.meshArr.length === 1){
         this.meshArr[0].position = new BABYLON.Vector3(x,y,z);
      }
   }
   rotateY(alpha){
      this.meshArr[0].rotation.y = alpha;
   }
   getPosition(){
      return {
         x: this.meshArr[0].position.x,
         y: this.meshArr[0].position.y,
         z: this.meshArr[0].position.z
      }
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
      let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, -10), this.scene);
      light.intensity = .75;
      this.light = light;

      /* Пол */      
      let ground = new TFloor(70, 40, scene);
      let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
      groundMaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      ground.setMaterial(groundMaterial);
      this.ground = ground;

      /* Передняя стенка */
      let back = new TWall(25, ground.width, this.scene);
      back.setPosition(0, back.height/2, ground.height/2);  
      let wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
      wallMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.5);
      back.setMaterial(wallMaterial);
      this.back = back;

      /* Правая стенка */
      let right = new TWall(back.height, ground.height, this.scene);
      right.setPosition(ground.width/2, back.height/2, back.getPosition().z - right.width/2);
      right.rotateY(Math.PI/2);
      right.setMaterial(wallMaterial);
      this.right = right;

      /* Левая стенка */
      let left = new TWall(back.height, ground.height, this.scene);
      left.setPosition(-ground.width/2, back.height/2, back.getPosition().z - left.width/2);
      left.rotateY(-Math.PI/2);
      left.setMaterial(wallMaterial);
      this.left = left;

      /* Потолок */
      let top = new TCeiling(ground.height, ground.width, scene);
      top.setPosition(ground.getPosition().x, back.height, ground.getPosition().z);
      this.top = top;

      let secFloor = new TFloor(ground.height/3, ground.width/4, scene);
      secFloor.setPosition(-secFloor.width*1.5, back.height/4, secFloor.height);
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

      let thirdFloor = new TFloor(ground.height/2, ground.width/4, scene);
      thirdFloor.setPosition(thirdFloor.width*1.5, back.height*0.6, thirdFloor.height/2);
      this.thirdFloor = thirdFloor;

      let stairs2 = new TStairs(thirdFloor.getPosition().y - secFloor.getPosition().y, thirdFloor.width, 
         Math.abs(thirdFloor.getPosition().x - thirdFloor.width/2 - secFloor.getPosition().x - secFloor.width/2), 15, this.scene);
      stairs2.setMaterial(stairsMaterial);
      stairs2.setPosition(secFloor.getPosition().x + secFloor.width/2 + stairs2.stairLength/2, secFloor.getPosition().y + stairs2.stairHeight/2,
       back.getPosition().z - stairs2.width/2);
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