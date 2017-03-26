import { Events } from '../constants/canvas';
import { Events as MouseEvents, EventsState as MouseEventsState } from '../constants/mouseEventsController';

export const setScene = (scene) => {
	return {
		type: Events.newSceneState,
		scene
	}
};

export const addPickedObjects = (newObjects) => {
	return {
		type: Events.newPickedObjects,
		newObjects
	}
};

export const deletePickedObjects = (newObjects) => {
	return {
		type: Events.deletePickedObjects,
		newObjects
	}
};

export const clearPickedObjects = () => {
	return {
		type: Events.clearPickedObjects
	}
};

export const setMouseProcessingState = (newMouseState) => {
	return {
		type: MouseEvents.setMouseProcessingState,
		newMouseState
	}
}

export const setObjectsInteraction = (newObjectsInterction) => {
	return {
		type: Events.setObjectsInteraction,
		newObjectsInterction
	}
}