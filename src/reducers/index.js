import { combineReducers } from 'redux';
import { canvas } from './canvas'
import { pickedObjects } from './pickedObjects'

const Reducers = combineReducers({canvas, pickedObjects});

export default Reducers;