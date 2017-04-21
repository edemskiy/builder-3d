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

export const setActiveControlMenu = (newActiveControlMenu) => {
	return {
		type: Events.setActiveControlMenu,
		newActiveControlMenu
	}
}

export const addTexture = (newTexture) => {
	return {
		type: Events.addTexture,
		value: newTexture
	}
}

export const deleteTexture = (textureName) => {
	return {
		type: Events.deleteTexture,
		textureName
	}
}

export const addCustomObject = (object) => {
	return {
		type: Events.addCustomObject,
		object
	}
}

export const deleteCustomObject = (objectName) => {
	return {
		type: Events.deleteCustomObject,
		objectName
	}
}