// eslint-disable-next-line
const BABYLON = window.BABYLON;

class Map {
   constructor(canvas) {
      this.engine = new BABYLON.Engine(canvas, true);      
      window.addEventListener('resize', () => {
            this.engine.resize();
         });
   }

   runRenderLoop(scene) {
      this.engine.runRenderLoop(() => {
         scene.render();
      });
   }
}

export default Map;