class TCeiling extends TWall{
   constructor(height, width, scene){
      super(height, width, scene);
      this.getMesh(0).rotation.x = -Math.PI/2;
   }
};