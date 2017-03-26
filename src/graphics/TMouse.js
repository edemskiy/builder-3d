//import TObjectControl from '../graphics/TObjectControl'
import { DefaultGround } from '../constants/initializer'

const BABYLON = window.BABYLON;

class TMouse{
	constructor(scene){
		this.scene = scene;
		this.ground = this.scene.meshes.filter( (mesh) => mesh.name === DefaultGround.name )[0];

		this.getGroundPosition = this.getGroundPosition.bind(this);
	}

	getGroundPosition(){
		let pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => (mesh === this.ground) );
		if (pickinfo.hit) {
			return pickinfo.pickedPoint;
		}
		return null;
	}

	createPointerDownObserver(func){
		this.pointerDownObserver = this.scene.onPointerObservable.add (func, BABYLON.PointerEventTypes.POINTERDOWN);
	}

	createPointerMoveObserver(func){
		this.pointerMoveObserver = this.scene.onPointerObservable.add (func, BABYLON.PointerEventTypes.POINTERMOVE);
	}

	createPointerUpObserver(func){
		this.pointerUpObserver = this.scene.onPointerObservable.add (func, BABYLON.PointerEventTypes.POINTERUP);
    }
}

export default TMouse;