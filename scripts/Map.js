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