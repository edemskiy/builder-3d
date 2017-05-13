import { Component } from 'react';
import { Canvas } from '../constants/canvas'
import { connect } from 'react-redux';
import {EventsState as MouseEventsState} from '../constants/mouseEventsController'
import {PickedObjects} from '../constants/pickedObjects'

import TObjectControl from '../graphics/TObjectControl'
import TMouse from '../graphics/TMouse'

import  { addPickedObjects, deletePickedObjects, clearPickedObjects, positionChange}  from '../actions/pickedObjects'

class Mouse extends Component{

	componentDidUpdate(prevProps){
		if(this.props.scene !== prevProps.scene){

			this.mouse = new TMouse(this.props.scene);
			this.objControl = new TObjectControl(this.props.scene);

			this.mouseDown = this.mouseDown.bind(this);
			this.mouseMove = this.mouseMove.bind(this);
			this.mouseUp = this.mouseUp.bind(this);

			this.mouse.createPointerDownObserver(this.mouseDown);
			this.mouse.createPointerMoveObserver(this.mouseMove);
			this.mouse.createPointerUpObserver(this.mouseUp);
		}
	}
		
	mouseDown(evt){
		switch(this.props.mouseControllerState){
			case MouseEventsState.base:
				if (evt.pickInfo.pickedMesh === null || evt.pickInfo.pickedMesh === this.mouse.ground)
					break;
				if (evt.pickInfo.pickedMesh.getObject && !evt.pickInfo.pickedMesh.getObject().isPicked)
					break;

				if (evt.pickInfo.hit) {
					this.currentMesh = evt.pickInfo.pickedMesh.getObject().getMesh();
					this.offset = this.objControl.getOffset();
					
					this.beginPosition = this.currentMesh.position.clone();
					this.startingPoint = this.mouse.getGroundPosition();

					if (this.startingPoint){
						setTimeout( () => {
							this.props.scene.activeCamera.detachControl(this.props.scene.getEngine().getRenderingCanvas());
						}, 0);
					}
				}
				break;
			case MouseEventsState.groupObjects: break;
			case MouseEventsState.pickObjects: break;
			default: break;
		}
	}

	mouseMove(evt){

		switch(this.props.mouseControllerState){
			case MouseEventsState.base:
				if (!this.startingPoint) break;

				const current = this.mouse.getGroundPosition();
				if (!current) break;

				const diff = current.subtract(this.startingPoint);
				diff.y = (this.offset.y - this.props.scene.pointerY)/10;

				if (this.currentMesh.isPin) {
					if(Math.sqrt( (this.offset.x - this.props.scene.pointerX)**2 + (this.offset.y - this.props.scene.pointerY)**2 ) < 50)
						return;
					else this.currentMesh.isPin = false;
				}

				if(this.currentMesh.getGroupObj)
					this.currentMesh.getGroupObj().move(diff, this.props.axisRestrictions.toObject());
				else
					this.objControl.move( [this.currentMesh], diff, this.props.axisRestrictions.toObject());

				if(this.props.adheranceObjects.get("toObjects"))
					this.objControl.adheranceObject(this.currentMesh);

				this.offset = this.objControl.getOffset();
				this.startingPoint = current;
				this.props.changePosition();
				break;		
			case MouseEventsState.pickObjects: break;
			default: break;
		}
	}

	mouseUp(evt){
		switch(this.props.mouseControllerState){

			case MouseEventsState.base: 
				if (this.startingPoint) {
					this.props.scene.activeCamera.attachControl(this.props.scene.getEngine().getRenderingCanvas(), true);

					if(this.currentMesh.getObject().getClassName() === "T3DObject")
						for(let i = 0; i < this.props.scene.meshes.length; i++){
							let tmpMesh = this.props.scene.meshes[i];
							if(!tmpMesh.getObject) continue;
							if(this.currentMesh.getContainingWall)
									this.currentMesh.getContainingWall().deleteObject(this.currentMesh.getObject(), this.beginPosition);
							if(tmpMesh.intersectsMesh(this.currentMesh) && tmpMesh.getObject().getClassName() === "TWall"){

								if(tmpMesh.getObject().isFreeSpace(this.currentMesh.getObject())){
									this.currentMesh.position = tmpMesh.getObject().getAddingObjPosition(this.currentMesh.position);
								}
								else
									this.currentMesh.position = this.beginPosition;

								tmpMesh.getObject().addObject(this.currentMesh.getObject());
								break;

							}
						}

					this.startingPoint = null;
					break;
				}
				else{
					this.props.scene.meshes.forEach((item) => {
						if(item.getObject){
							item.getObject().unpick();
						}
					});
					this.props.clrPickedObjects();
					if(evt.pickInfo.pickedMesh === null) break;
					const pickedMesh = evt.pickInfo.pickedMesh;
					if (pickedMesh.getObject) {
						pickedMesh.getObject().pick();

						this.props.addNewPickedObjects([pickedMesh]);

						if(pickedMesh.getGroupObj){
							pickedMesh.getGroupObj().pickAll();
							this.props.addNewPickedObjects(pickedMesh.getGroupObj().objArr);
						}
					}
				}
				break;

			case MouseEventsState.pickObjects: 
				if(evt.pickInfo.pickedMesh === null) break;

				if(evt.pickInfo.pickedMesh.getObject){
					const pickedMeshObj = evt.pickInfo.pickedMesh.getObject();
					if (pickedMeshObj.isPicked){
						if(pickedMeshObj.getGroupObj){
							pickedMeshObj.getGroupObj().unpickAll();
							this.props.delPickedObjects(pickedMeshObj.getGroupObj().objArr);
							break;
						}
						pickedMeshObj.unpick();
						this.props.delPickedObjects([pickedMeshObj.getMesh()]);
					}
					else{
						if(pickedMeshObj.getGroupObj){
							pickedMeshObj.getGroupObj().pickAll();
							this.props.addNewPickedObjects(pickedMeshObj.getGroupObj().objArr);
							break;
						}
						pickedMeshObj.pick();
						this.props.addNewPickedObjects([pickedMeshObj.getMesh()]);
					}
				}
				break;

			case MouseEventsState.groupObjects: break;
			default: break;
		}
		
	}

	render(){
		return null;
	}


}

const mapStateCanvasProps = (state, ownProps) => {
	return {
		scene: state.canvas.get(Canvas.scene),
		pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
		mouseControllerState: state.canvas.get(Canvas.mouseControllerState),
		axisRestrictions: state.pickedObjects.get(PickedObjects.axisRestrictions),
		adheranceObjects: state.pickedObjects.get(PickedObjects.adheranceObjects)
		//positionChange: state.pickedObjects.get(PickedObjects.isPositionChanged)
	}
};

const mapDispatchToCanvasProps = (dispatch) => {
	return {
		addNewPickedObjects: (newObjects) => {
			dispatch(addPickedObjects(newObjects))
		},
		
		delPickedObjects: (newObjects) => {
			dispatch(deletePickedObjects(newObjects))
		},

		clrPickedObjects: () => {
			dispatch(clearPickedObjects())
		},

		changePosition: () => {
			dispatch(positionChange())
		}
	}
};

export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(Mouse);