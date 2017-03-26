import { Events, Canvas } from '../constants/canvas';
import { Events as MouseEvents } from '../constants/mouseEventsController'
import Immutable from 'immutable';
import { state as InitialState } from '../states/canvas'

export const canvas = (state = InitialState, action) => {
	switch(action.type){
		case Events.newSceneState:		
			return changeSceneState(state, action);
		case Events.newPickedObjects:
			return addNewPickedObjects(state, action);
		case Events.deletePickedObjects:
			return deletePickedObjects(state, action);
		case Events.clearPickedObjects:
			return clearPickedObjects(state, action);
		case MouseEvents.setMouseProcessingState:
			return setMouseProcessingState(state, action);
		default:
			return state;
	}
};



function changeSceneState(state, action) {
	const scene = action.scene;
	return state.set(Canvas.scene, scene);
}

function addNewPickedObjects(state, action){
	const newPickedObjets = state.get(Canvas.pickedObjects).concat(Immutable.List(action.newObjects));
	return state.set(Canvas.pickedObjects, newPickedObjets);
}

function deletePickedObjects(state, action){
	const newPickedObjets = state.get(Canvas.pickedObjects).filter( value => action.newObjects.every( item => item !== value));
	return state.set(Canvas.pickedObjects, newPickedObjets);
}

function clearPickedObjects(state, action){
	return state.set(Canvas.pickedObjects, state.get(Canvas.pickedObjects).clear());
}

function setMouseProcessingState(state, action){
	return state.set(Canvas.mouseControllerState, action.newMouseState);
}


