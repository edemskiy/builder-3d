class T3DObject extends TRigid {
	constructor(options) {
		super(options);
		BABYLON.SceneLoader.ImportMesh('', 'scenes/', options.name + '.babylon', map.getScene(), (newMeshes) => {
			
			this.mesh = map.getScene().meshes[map.getScene().meshes.length - 1];
			this.mesh.name = options.name + Math.random().toFixed(3) * 1000;
			this.name = this.mesh.name;
			this.mesh.checkCollisions = this.collision;
			const size = this.mesh.getBoundingInfo().boundingBox.extendSize;

			this.mesh.scaling.x = 0.5*options.width/size.x;
			this.mesh.scaling.y = 0.5*options.height/size.y;
			this.mesh.scaling.z = 0.5*options.depth/size.z;
			
			this.height = options.height;
			this.width = options.width;
			this.depth = options.depth;

			this.mesh.position = new BABYLON.Vector3(options.position.x,options.position.y,options.position.z);
			this.addMesh(this.mesh);
		});
	}
}