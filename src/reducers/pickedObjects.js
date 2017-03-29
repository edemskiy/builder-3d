import { Events, PickedObjects } from '../constants/pickedObjects';
//import { Events as MouseEvents } from '../constants/mouseEventsController'
import Immutable from 'immutable';
import { state as InitialState } from '../states/pickedObjects'

export const pickedObjects = (state = InitialState, action) => {
	switch(action.type){
		case Events.newPickedObjects:
			return addNewPickedObjects(state, action);
		case Events.deletePickedObjects:
			return deletePickedObjects(state, action);
		case Events.clearPickedObjects:
			return clearPickedObjects(state, action);
		case Events.positionChange:
			return positionChange(state, action);
		case Events.sizeChange:
			return sizeChange(state, action);
		case Events.rotationChange:
			return rotationChange(state, action);
		case Events.textureChange:
			return textureChange(state, action);
		case Events.setAxisRestriction:
			return setAxisRestriction(state, action);
		case Events.setAdheranceObjects:
			return setAdheranceObjects(state, action)
		default:
			return state;
	}
};

function addNewPickedObjects(state, action){
	const newPickedObjets = state.get(PickedObjects.pickedObjects).concat(Immutable.List(action.newObjects));
	return state.set(PickedObjects.pickedObjects, newPickedObjets);
}

function deletePickedObjects(state, action){
	const newPickedObjets = state.get(PickedObjects.pickedObjects).filter( value => action.newObjects.every( item => item !== value));
	return state.set(PickedObjects.pickedObjects, newPickedObjets);
}

function clearPickedObjects(state, action){
	return state.set(PickedObjects.pickedObjects, state.get(PickedObjects.pickedObjects).clear());
}

function positionChange(state, action){
	return state.set(PickedObjects.isPositionChanged, state.get(PickedObjects.isPositionChanged) + 1);
}

function sizeChange(state, action){
	return state.set(PickedObjects.isSizeChanged, state.get(PickedObjects.isSizeChanged) + 1);
}

function rotationChange(state, action){
	return state.set(PickedObjects.isRotationChanged, state.get(PickedObjects.isRotationChanged) + 1);
}

function textureChange(state, action){
	return state.set(PickedObjects.isTextureChanged, state.get(PickedObjects.isTextureChanged) + 1);
}

function setAxisRestriction(state, action){
	return state.set(PickedObjects.axisRestrictions, Immutable.Map(action.value));
}

function setAdheranceObjects(state, action){
	return state.set(PickedObjects.adheranceObjects, Immutable.Map(action.value));
}