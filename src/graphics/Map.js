// eslint-disable-next-line
const BABYLON = window.BABYLON;

//import Scene from './Scene.js'

class Map {
   constructor(canvas) {
      this.engine = new BABYLON.Engine(canvas, true);
      /*this.scene = new Scene(this.engine, canvas);*/
      
      window.addEventListener('resize', () => {
            this.engine.resize();
         });
   }

   runRenderLoop(scene) {
      /*scene.createScene();*/
      this.engine.runRenderLoop(() => {
         scene.render();
      });
   }

/*   getSceneObject(){
      return this.scene;
   }*/
   
/*   getScene() {
      return this.scene.getScene();
   }*/
}

export default Map;