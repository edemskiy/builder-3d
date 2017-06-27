import { Events } from '../constants/pickedObjects';

export const clearPickedObjects = () => ({ type: Events.clearPickedObjects });

export const addPickedObjects = newObjects => (
  {
    type: Events.newPickedObjects,
    newObjects,
  }
);

export const deletePickedObjects = newObjects => (
  {
    type: Events.deletePickedObjects,
    newObjects,
  }
);

export const setAxisRestrictions = newAxisRestrictions => (
  {
    type: Events.setAxisRestriction,
    value: newAxisRestrictions,
  }
);

export const setAdheranceObjects = newAdheranceObjects => (
  {
    type: Events.setAdheranceObjects,
    value: newAdheranceObjects,
  }
);

export const sizeChange = () => ({ type: Events.sizeChange });

export const positionChange = () => ({ type: Events.positionChange });

export const rotationChange = () => ({ type: Events.rotationChange });

export const textureChange = () => ({ type: Events.textureChange });
