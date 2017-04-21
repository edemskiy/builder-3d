// eslint-disable-next-line
const BABYLON = window.BABYLON;
import TCutout from './TCutout.js'

class TWindow extends TCutout{
	constructor(options){
		super(options)
	}
	createObject(){
		this.meshArr[0] = BABYLON.MeshBuilder.CreateBox(name, {height: this.height, width: this.width, depth: this.depth, updateble: true}, this.scene);
	}
}

export default TWindow