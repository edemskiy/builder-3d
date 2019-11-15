import { Events, Canvas } from "../constants/canvas";
import { Events as MouseEvents } from "../constants/mouseEventsController";
import InitialState from "../states/canvas";

function changeSceneState(state, action) {
  const scene = action.scene;
  return state.set(Canvas.scene, scene);
}

function setMouseProcessingState(state, action) {
  return state.set(Canvas.mouseControllerState, action.newMouseState);
}

function setActiveControlMenu(state, action) {
  return state.set(Canvas.activeControlMenu, action.newActiveControlMenu);
}

function addTexture(state, action) {
  return state.set(
    Canvas.textures,
    state.get(Canvas.textures).set(action.value.name, action.value.src)
  );
}

function deleteTexture(state, action) {
  return state.set(
    Canvas.textures,
    state.get(Canvas.textures).delete(action.textureName)
  );
}

function addCustomObject(state, action) {
  return state.set(
    Canvas.customObjects,
    state.get(Canvas.customObjects).set(action.object.name, action.object.src)
  );
}

function deleteCustomObject(state, action) {
  return state.set(
    Canvas.customObjects,
    state.get(Canvas.customObjects).delete(action.objectName)
  );
}

const canvas = (state = InitialState, action) => {
  switch (action.type) {
    case Events.newSceneState:
      return changeSceneState(state, action);
    case MouseEvents.setMouseProcessingState:
      return setMouseProcessingState(state, action);
    case Events.setActiveControlMenu:
      return setActiveControlMenu(state, action);
    case Events.addTexture:
      return addTexture(state, action);
    case Events.deleteTexture:
      return deleteTexture(state, action);
    case Events.addCustomObject:
      return addCustomObject(state, action);
    case Events.deleteCustomObject:
      return deleteCustomObject(state, action);
    default:
      return state;
  }
};

export default canvas;
