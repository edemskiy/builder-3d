class TCutout extends TRigid{
	constructor(height, width, depth, name, scene){
		super(scene);
		this.scene = scene;
		this.name = name;
		this.height = height;
		this.width = width;
		this.depth = depth;
		this.cutObject = null;
	}
	getObject(){
		return this.cutObject;
	}
}