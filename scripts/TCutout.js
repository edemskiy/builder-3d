class TCutout extends TRigid{
	constructor(options){
		super();
		this.name = options.name;
		this.height = options.height;
		this.width = options.width;
		this.depth = options.depth;
		this.cutObject = null;
		this.addingMode = "difference";
		this.position = {
			x: options.position.x,
			y: options.position.y,
			z: options.position.z
		};
	}
	getObject(){
		return this.cutObject;
	}
}