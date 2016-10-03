class TWindow extends TCutout{
	constructor(options){
		super(options)
	}
	createObject(){
		this.cutObject = BABYLON.MeshBuilder.CreateBox(name, {height: this.height, width: this.width, depth: this.depth, updateble: true}, map.getScene());
	}
}