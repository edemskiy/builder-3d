import Immutable from "immutable";
import { Canvas } from "../constants/canvas";
import { EventsState as MouseEventsState } from "../constants/mouseEventsController";

const state = Immutable.Map([
  [Canvas.scene, null],
  [Canvas.mouseControllerState, MouseEventsState.base],
  [Canvas.activeControlMenu, "ObjectsMenu"],
  [Canvas.textures, Immutable.Map()],
  [Canvas.customObjects, Immutable.Map()]
]);

export default state;
