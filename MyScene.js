class Scene {
   constructor (engine){
      this.scene = new BABYLON.Scene(engine);
         
      this.scene.clearColor = new BABYLON.Color3(1, 1, 1);
      this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 5, -20), this.scene);
      this.camera.setTarget(BABYLON.Vector3.Zero());
      this.camera.attachControl(canvas, false);

      /* Свет */
      this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, -10), this.scene);
      this.light.intensity = .75;

      /* Пол */
      // Params: name, width, depth, subdivisions, scene
      this.ground = BABYLON.Mesh.CreateGround("ground1", 25, 25, 2, this.scene);
      this.ground.scaling.z = 2;
      this.groundmaterial = new BABYLON.StandardMaterial("groundmaterial", this.scene);
      this.groundmaterial.diffuseColor = new BABYLON.Color3(1, 0.85, 0.62);
      this.ground.material = this.groundmaterial;

      /* Передняя стенка */
      this.back = BABYLON.Mesh.CreatePlane("back", 25.0, this.scene);
      this.back.position = new BABYLON.Vector3(0,6.25,25);
      this.back.scaling.y = 0.5;
      this.backmaterial = new BABYLON.StandardMaterial("backmaterial", this.scene);
      this.backmaterial.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.5);
      this.back.material = this.backmaterial;

         /* Правая стенка */
      this.right = BABYLON.Mesh.CreatePlane("left", 25.0, this.scene);
      this.right.position = new BABYLON.Vector3(12.5,6.25,0);
      this.right.rotation.y = Math.PI/2;
      this.right.scaling.x = 2;
      this.right.scaling.y = 0.5;
      this.right.material = this.backmaterial;

         /* Левая стенка */
      this.left = BABYLON.Mesh.CreatePlane("right", 25.0, this.scene);
      this.left.position = new BABYLON.Vector3(-12.5,6.25,0);
      this.left.rotation.y = -Math.PI/2;
      this.left.scaling.x = 2;
      this.left.scaling.y = 0.5;
      this.left.material = this.backmaterial;

         /* Потолок */
      this.top = BABYLON.Mesh.CreateGround("top", 25, 25, 2, this.scene);
      this.top.rotation.x = Math.PI;
      this.top.position.y = 12.5;
      this.top.scaling.z = 2;

         /* Наклонная плоскость */
      this.upstair1 = BABYLON.Mesh.CreatePlane("upstair1", 5.0, this.scene);
      this.upstair1.position = new BABYLON.Vector3(-10,2,6);
      this.upstair1.rotation.x = Math.PI/3;
      this.upstair1.scaling.y = 2;

         /* Возвышенность */
      this.upstair2 = BABYLON.Mesh.CreatePlane("upstair2", 5.0, this.scene);
      this.upstair2.position = new BABYLON.Vector3(0,4.5,17.5);
      this.upstair2.rotation.x = Math.PI/2;
      this.upstair2.scaling.y = 3;
      this.upstair2.scaling.x = 5;

      this.scene.collisionsEnabled = true;
      this.scene.gravity = new BABYLON.Vector3(0, -2, 0); 
         
      this.camera.ellipsoid = new BABYLON.Vector3(1, 2.5, 1);
      this.camera.checkCollisions = true;
      this.camera.applyGravity = true;
      this.ground.checkCollisions = true;
      this.back.checkCollisions = true;
      this.left.checkCollisions = true;
      this.right.checkCollisions = true;
      this.upstair1.checkCollisions = true;
      this.upstair2.checkCollisions = true;
   }
   getScene() {
      return this.scene;
   }
}

class Map {
   constructor(canvas){
      this.canvas = canvas;
      this.engine = new BABYLON.Engine(canvas, true);
      this.scene = new Scene(this.engine).getScene();
   }
   runRenderLoop() {
      this.engine.runRenderLoop(() => {
         this.scene.render();
      });
   }
}