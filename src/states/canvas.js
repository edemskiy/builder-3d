import { Canvas } from '../constants/canvas';
import { EventsState as MouseEventsState} from '../constants/mouseEventsController';
import Immutable from 'immutable';

export const state = Immutable.Map([
	[Canvas.scene, null],
	[Canvas.mouseControllerState, MouseEventsState.base],
	[Canvas.activeControlMenu, "ObjectsMenu"],
	[Canvas.textures, Immutable.Map()],
	[Canvas.customObjects, Immutable.Map()]
]);

