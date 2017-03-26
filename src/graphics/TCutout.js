// eslint-disable-next-line
const BABYLON = window.BABYLON;
import TRigid from './TRigid.js'

class TCutout extends TRigid{
	constructor(options){
		super();
		this.name = options.name;
		this.height = options.height;
		this.width = options.width;
		this.depth = options.depth;		
		this.addingMode = "difference";
		
		this.position = new BABYLON.Vector3(options.position.x, options.position.y, options.position.z);
	}
}

export default TCutout