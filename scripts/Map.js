class Map {
   constructor(canvas) {
      this.engine = new BABYLON.Engine(canvas, true);
      this.scene = new Scene(this.engine);
      
      window.addEventListener('resize', () => {
            this.engine.resize();
         });
   }

   runRenderLoop() {
      this.scene.createScene();
      this.engine.runRenderLoop(() => {
         this.scene.getScene().render();
      });
   }
   
   getScene() {
      return this.scene.getScene();
   }
}