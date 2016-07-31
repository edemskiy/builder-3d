class TStairs extends TRigid{
   constructor(height, width, length, stairsNum, scene){
      super(scene);
      let stairHeight = height/stairsNum;
      let stairLength = length/stairsNum;
      for(let i = 0; i < stairsNum; i++){
         let tmp = new BABYLON.Mesh.CreateBox("stair" + i, stairHeight, scene);
         tmp.scaling.x = width/stairHeight;
         tmp.scaling.z = stairLength/stairHeight;
         tmp.position = new BABYLON.Vector3(0, i*stairHeight, i*stairLength);
         tmp.checkCollisions = this.collision;
         this.addMesh(tmp);
      }
      this.stairsNum = stairsNum;
      this.stairHeight = stairHeight;
      this.stairLength = stairLength;
      this.length = length;
      this.height = height;
      this.width = width;
   }
   setPosition(x,y,z){
      for(let i = 0; i < this.stairsNum; i++){
         this.getMesh(i).position = new BABYLON.Vector3(x, y + i*this.stairHeight, z + i*this.stairLength);
      }
   }
   rotateY(alpha){
      for(let i = 0; i < this.stairsNum; i++){
         this.getMesh(i).rotation.y = alpha;
         let currPos = this.getMesh(i).getPositionExpressedInLocalSpace();
         this.getMesh(i).position = new BABYLON.Vector3(currPos.x + i*this.stairLength*Math.sin(alpha), currPos.y,
            this.getMesh(0).getPositionExpressedInLocalSpace().z + i*this.stairLength*Math.cos(alpha));
      }
   }
};