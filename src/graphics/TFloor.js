import TWall from './TWall'

class TFloor extends TWall{
   constructor(height, width, depth, name){
      super(height, width, depth, name);
      this.getMesh().rotation.x = Math.PI/2;
      this.getMesh().position.y = this.depth/2;
   }
};

export default TFloor