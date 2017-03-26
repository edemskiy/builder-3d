import TWall from './TWall'

class TFloor extends TWall{
   constructor(height, width, depth, name){
      super(height, width, depth, name);
      this.getMesh(0).rotation.x = Math.PI/2;
   }
};

export default TFloor