class TDoor extends TCutout{
	constructor(height, width, depth, scene){
		super(height, width, depth, "TDoor", scene)
	}
	createObject(){
		this.cutObject = BABYLON.MeshBuilder.CreateBox(name, {height: this.height, width: this.width, depth: this.depth, updateble: true}, this.scene);
	}
}