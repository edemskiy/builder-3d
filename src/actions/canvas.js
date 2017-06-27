import { Events } from '../constants/canvas';
import { Events as MouseEvents } from '../constants/mouseEventsController';

export const setScene = scene => (
  {
    type: Events.newSceneState,
    scene,
  }
);

export const setMouseProcessingState = newMouseState => (
  {
    type: MouseEvents.setMouseProcessingState,
    newMouseState,
  }
);

export const setObjectsInteraction = newObjectsInteraction => (
  {
    type: Events.setObjectsInteraction,
    value: newObjectsInteraction,
  }
);

export const setActiveControlMenu = newActiveControlMenu => (
  {
    type: Events.setActiveControlMenu,
    newActiveControlMenu,
  }
);

export const addTexture = newTexture => (
  {
    type: Events.addTexture,
    value: newTexture,
  }
);

export const deleteTexture = textureName => (
  {
    type: Events.deleteTexture,
    textureName,
  }
);

export const addCustomObject = object => (
  {
    type: Events.addCustomObject,
    object,
  }
);

export const deleteCustomObject = objectName => (
  {
    type: Events.deleteCustomObject,
    objectName,
  }
);
