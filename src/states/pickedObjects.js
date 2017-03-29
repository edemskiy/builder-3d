import Immutable from 'immutable';
import { PickedObjects } from '../constants/pickedObjects';


export const state = Immutable.Map([
	[PickedObjects.pickedObjects, Immutable.List()],
	[PickedObjects.isPositionChanged, 0],
	[PickedObjects.isSizeChanged, 0],
	[PickedObjects.isRotationChanged, 0],
	[PickedObjects.isTextureChanged, 0],
	[PickedObjects.axisRestrictions, Immutable.Map([
		["x", true],
		["y", false],
		["z", true]
		])
	],
	[PickedObjects.adheranceObjects, Immutable.Map([
		["toObjects", false],
		["toGrid", false]
		])
	]
]);
