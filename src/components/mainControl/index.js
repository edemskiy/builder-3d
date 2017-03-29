import React, { Component } from 'react';
import {connect} from 'react-redux';

import { setMouseProcessingState, setObjectsInteraction } from '../../actions/canvas'
import { EventsState as MouseEventsState } from  '../../constants/mouseEventsController'
import { EventsState as ObjInteractionEventsState } from  '../../constants/objectsInteraction'
import { Canvas } from '../../constants/canvas'
import { positionChange, rotationChange, sizeChange } from '../../actions/pickedObjects'
import {clearPickedObjects}  from '../../actions/pickedObjects'


import { PickedObjects } from '../../constants/pickedObjects'


class MainControl extends Component {

	componentDidUpdate(prevProps){
		// if((this.props.pickedObjects.size !== prevProps.pickedObjects.size) && (this.props.pickedObjects.size !== 0))
		// 	this.refs.groupObjects.classList.remove('hidden');
		// else
		// 	this.refs.groupObjects.classList.add('hidden');
	}


	pickObjects(){
		if(this.props.mouseControllerState === MouseEventsState.pickObjects){
			this.props.setNewMouseState(MouseEventsState.base);
			this.refs.pickObjects.className = 'blue';
			this.refs.groupObjects.classList.add('hidden');
			return;
		}
		this.props.setNewMouseState(MouseEventsState.pickObjects);
		this.refs.pickObjects.className = 'green';
		this.refs.groupObjects.classList.remove('hidden');		
	}

	groupObjects(){
		this.props.setObjectInteraction(ObjInteractionEventsState.group);
		this.pickObjects();
		this.props.clrPickedObjects();
		this.props.changePosition();
		this.props.changeRotation();
		this.props.changeSize();
	}

	render(){
	    return (
	    	<div className="elements-block">
		    	<div className="flex-row content-start">
			    	<button  onClick={ () => this.pickObjects() } className="blue" ref='pickObjects' id="pickObjects">Выделение объектов</button>
			    	<button  onClick={ () => this.groupObjects() } className="blue hidden" ref='groupObjects' id="makeGroup">Сгруппировать</button>
		    	</div>
		    	<div className="flex-row">
			    	<div className="styled-select">
				    	<select className="select" id="selectAddingObject">
					    	<option>Блок</option>
					    	<option>sample1</option>
					    	<option>sample2</option>
				    	</select>
			    	</div>
			    	<button className="blue" id="addObject">Добавить</button>
		    	</div>
	    	</div>
	    );
	}
}

const mapStateCanvasProps = (state, ownProps) => {
	return {
		//scene: state.canvas.get(Canvas.scene),
		pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
		mouseControllerState: state.canvas.get(Canvas.mouseControllerState)
	}
};

const mapDispatchToCanvasProps = (dispatch) => {
	return {
		setNewMouseState: (newMouseState) => {
			dispatch(setMouseProcessingState(newMouseState))
		},
		setObjectInteraction: (newObjectsInterction) => {
			dispatch(setObjectsInteraction(newObjectsInterction))
		},
		changePosition: () => {
			dispatch(positionChange())
		},
		changeRotation: () => {
			dispatch(rotationChange())
		},
		changeSize: () => {
			dispatch(sizeChange())
		},
		clrPickedObjects: () => {
			dispatch(clearPickedObjects())
		},
	}
};


export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(MainControl);
