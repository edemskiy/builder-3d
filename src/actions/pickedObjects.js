import { Events } from '../constants/pickedObjects';


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

export const sizeChange = () => {
	return {
		type: Events.sizeChange
	}
}

export const positionChange = () => {
	return {
		type: Events.positionChange
	}
}

export const rotationChange = () => {
	return {
		type: Events.rotationChange
	}
}

export const textureChange = () => {
	return {
		type: Events.textureChange
	}
}

export const setAxisRestrictions = (newAxisRestrictions) => {
	return {
		type: Events.setAxisRestriction,
		value: newAxisRestrictions
	}
}

export const setAdheranceObjects = (newAdheranceObjects) => {
	return {
		type: Events.setAdheranceObjects,
		value: newAdheranceObjects
	}
}