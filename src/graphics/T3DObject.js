const BABYLON = window.BABYLON;
import TRigid from './TRigid.js'

class T3DObject extends TRigid {
	constructor(options) {
		super(options.scene);
		BABYLON.SceneLoader.ImportMesh('', '', options.src, options.scene, (newMeshes) => {
			
			this.args = options;
			this.mesh = options.scene.meshes[options.scene.meshes.length - 1];
			this.mesh.getObject = () => this;
			this.mesh.name = options.name + Math.random().toFixed(3) * 1000;
			this.name = this.mesh.name;
			this.mesh.checkCollisions = this.collision;
			const size = this.mesh.getBoundingInfo().boundingBox.extendSize;

			// this.mesh.scaling.x = 0.5*options.width/size.x;
			// this.mesh.scaling.y = 0.5*options.height/size.y;
			// this.mesh.scaling.z = 0.5*options.depth/size.z;
			
			// this.height = options.height;
			// this.width = options.width;
			// this.depth = options.depth;

			this.height = 2*size.y;
			this.width = 2*size.x;
			this.depth = 2*size.z;

			this.mesh.position.y += this.height/2;
			this.addMesh(this.mesh);
		});
	}

	setPosition(x,y,z){
		const beginPosition = this.getPosition();
		this.getMesh().position = new BABYLON.Vector3(x,y,z);

		for(let i = 0; i < this.args.scene.meshes.length; i++){
			let tmpMesh = this.args.scene.meshes[i];
			if(!tmpMesh.getObject) continue;
			if(tmpMesh.intersectsMesh(this.getMesh()) && tmpMesh.getObject().getClassName() === "TWall"){
				if(tmpMesh.getObject().isFreeSpace(this)){
					if(this.getMesh().getContainingWall){
						this.getMesh().getContainingWall().deleteObject(this, beginPosition);
					}
					this.getMesh().position = tmpMesh.getObject().getAddingObjPosition(this.getMesh().position);
					tmpMesh.getObject().addObject(this);
				}
				else
					//this.getMesh().position = beginPosition;
				break;
			}
		}
	}

	move(diff, check){
		if(this.getMesh().getContainingWall){
			const currentMesh = this.getMesh();
			const containingWall = currentMesh.getContainingWall();
			const alpha = -containingWall.getRotationY();

			if(alpha % Math.PI === 0){
				if(check.x) currentMesh.position.x += diff.x;
				return;
			}

			if(Math.abs(alpha) === Math.PI/2){
				if(check.z) currentMesh.position.z += diff.z;
				return;
			}

			const x1 = currentMesh.position.x + diff.x, z1 = currentMesh.position.z + diff.z, x0 = currentMesh.position.x, z0 = currentMesh.position.z;
			const x = (Math.tan(alpha) * (z1 - z0 + x0 * Math.tan(alpha)) + x1) / (Math.tan(alpha) ** 2 + 1);
			const z = (Math.tan(alpha) * x + z0 - Math.tan(alpha)*x0);

			currentMesh.position.x = x;
			currentMesh.position.z = z;
		}
		else{
			if(check.x) this.getMesh().position.x += diff.x;
			if(check.y) this.getMesh().position.y += diff.y;
			if(check.z) this.getMesh().position.z += diff.z;
		}
	}
}

export default T3DObject;