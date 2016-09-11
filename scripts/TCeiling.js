class TCeiling extends TWall{
   constructor(height, width, depth, name, scene){
      super(height, width, depth, name, scene);
      this.getMesh(0).rotation.x = -Math.PI/2;
   }
};