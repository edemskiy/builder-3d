import { Events } from '../constants/canvas';
import { Events as MouseEvents} from '../constants/mouseEventsController';

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

export const setObjectsInteraction = (newObjectsInteraction) => {
	return {
		type: Events.setObjectsInteraction,
		value: newObjectsInteraction
	}
}