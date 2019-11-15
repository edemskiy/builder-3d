import TObjectControl from "../graphics/TObjectControl";
import {
  Events as ObjectsInteractionEvents,
  EventsState as ObjectsInteractionEventsState
} from "../constants/objectsInteraction";

import { PickedObjects } from "../constants/pickedObjects";

class ObjectInteraction {
  constructor() {
    this.objControl = new TObjectControl();
    this.changeEmitterMiddleware = ({
      getStore,
      dispatch
    }) => next => action => {
      switch (action.type) {
        case ObjectsInteractionEvents.setObjectsInteraction:
          switch (action.value) {
            case ObjectsInteractionEventsState.group:
              this.objControl.groupObjects(
                this.store
                  .getState()
                  .pickedObjects.get(PickedObjects.pickedObjects)
                  .toArray()
              );
              break;
            case ObjectsInteractionEventsState.clone:
              this.objControl.cloneObjects(
                this.store
                  .getState()
                  .pickedObjects.get(PickedObjects.pickedObjects)
                  .toArray()
              );
              break;
            case ObjectsInteractionEventsState.delete:
              this.objControl.deleteObjects(
                this.store
                  .getState()
                  .pickedObjects.get(PickedObjects.pickedObjects)
                  .toArray()
              );
              break;
            case ObjectsInteractionEventsState.ungroup:
              this.objControl.ungroupObjects(
                this.store
                  .getState()
                  .pickedObjects.get(PickedObjects.pickedObjects)
                  .toArray()
              );
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return next(action);
    };
  }

  setStore(store) {
    this.store = store;
  }
}

export default ObjectInteraction;
