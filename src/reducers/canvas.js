import { Events, Canvas } from '../constants/canvas';
import { Events as MouseEvents } from '../constants/mouseEventsController'
import { state as InitialState } from '../states/canvas'

export const canvas = (state = InitialState, action) => {
	switch(action.type){
		case Events.newSceneState:		
			return changeSceneState(state, action);
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

function setMouseProcessingState(state, action){
	return state.set(Canvas.mouseControllerState, action.newMouseState);
}


