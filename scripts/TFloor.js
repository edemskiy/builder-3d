class TFloor extends TWall{
   constructor(height, width, name, scene){
      super(height, width, name, scene);
      this.getMesh(0).rotation.x = Math.PI/2;
   }
};