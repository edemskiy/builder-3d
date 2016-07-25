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
      console.log(this);
   }
   setSize(height, width){
      this.meshArr[0].scaling.y = height/this.height;
      this.meshArr[0].scaling.x = width/this.width;
      this.height = height;
      this.width = width;
   }
   setPosition(x, y, z){
      this.meshArr[0].position = new BABYLON.Vector3(x,y,z);
   }
   rotateY(alpha){
      this.meshArr[0].rotation.y = alpha;
   }
   setMaterial(material){
      meshArr[0].material = material;
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
      // Params: name, width, depth, subdivisions, scene
      let ground = BABYLON.Mesh.CreateGround("ground1", 25, 25, 2, this.scene);
      ground.scaling.z = 2;
      let groundmaterial = new BABYLON.StandardMaterial("groundmaterial", this.scene);
      groundmaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      ground.material = groundmaterial;
      this.groundmaterial = groundmaterial;
      this.ground = ground;

      /* Передняя стенка */
      let back = BABYLON.Mesh.CreatePlane("back", 25.0, this.scene);
      back.position = new BABYLON.Vector3(0,6.25,25);
      back.scaling.y = 0.5;
      let backmaterial = new BABYLON.StandardMaterial("backmaterial", scene);
      backmaterial.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.5);
      back.material = backmaterial;
      this.backmaterial = backmaterial;
      this.back = back;

      /* Правая стенка */
      let right = BABYLON.Mesh.CreatePlane("left", 25.0, this.scene);
      right.position = new BABYLON.Vector3(12.5,6.25,0);
      right.rotation.y = Math.PI/2;
      right.scaling.x = 2;
      right.scaling.y = 0.5;
      right.material = this.backmaterial;
      this.right = right;

      /* Левая стенка */
      let left = BABYLON.Mesh.CreatePlane("right", 25.0, this.scene);
      left.position = new BABYLON.Vector3(-12.5,6.25,0);
      left.rotation.y = -Math.PI/2;
      left.scaling.x = 2;
      left.scaling.y = 0.5;
      left.material = this.backmaterial;
      this.left = left;

      /* Потолок */
      let top = BABYLON.Mesh.CreateGround("top", 25, 25, 2, this.scene);
      top.rotation.x = Math.PI;
      top.position.y = 12.5;
      top.scaling.z = 2;
      this.top = top;

      /* Лестница */
      //Params for stairs: height, width, length, stairsNum, scene
      let stairs = new TStairs(4.6, 5, 10, 12, scene);
      let stairsMaterial = new BABYLON.StandardMaterial("stairsMaterial", this.scene);
      stairsMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.8, 0.7);
      stairs.setMaterial(stairsMaterial);
      stairs.setPosition(0,stairs.stairHeight/2,0.4);
      stairs.rotateY(0);
      this.stairs = stairs;

      /* Возвышенность */
      let upstair2 = BABYLON.Mesh.CreatePlane("upstair2", 5.0, this.scene);
      upstair2.position = new BABYLON.Vector3(0,4.5,17.5);
      upstair2.rotation.x = Math.PI/2;
      upstair2.scaling.y = 3;
      upstair2.scaling.x = 5;
      this.upstair2 = upstair2;

      this.ground.checkCollisions = true;
      this.back.checkCollisions = true;
      this.left.checkCollisions = true;
      this.right.checkCollisions = true;
      this.upstair2.checkCollisions = true;
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