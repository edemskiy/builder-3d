class TDoor extends TCutout{
	constructor(options){
		super(options);
		this.position.y = this.height/2;
	}
	createObject(){
		this.cutObject = BABYLON.MeshBuilder.CreateBox(name, {height: this.height, width: this.width, depth: this.depth, updateble: true}, map.getScene());
	}
}