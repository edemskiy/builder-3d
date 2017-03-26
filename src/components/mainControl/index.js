import React, { Component } from 'react';
import {connect} from 'react-redux';

import { setMouseProcessingState } from '../../actions/canvas'
import { EventsState as MouseEventsState} from  '../../constants/mouseEventsController'
import { Canvas } from '../../constants/canvas'
import { Events as ObjectsInteractionEvents,
EventsState as ObjectsInteractionEventsState } from '../../constants/canvas'


class MainControl extends Component {


	componentDidMount(){

	}

	pickObjects(){
		if(this.props.mouseControllerState === MouseEventsState.pickObjects){
			this.props.setNewMouseState(MouseEventsState.base);
			return;
		}
		this.props.setNewMouseState(MouseEventsState.pickObjects);
	}

	groupObjects(){

	}

	render(){

	    return (
	    	<div className="elements-block">
		    	<div className="flex-row content-start">
			    	<button  onClick={ () => this.pickObjects() } className="btn" id="pickObjects">Выделение объектов</button>
			    	<button  onClick={ () => this.groupObjects() } className="btn hidden" id="makeGroup">Сгруппировать</button>
		    	</div>
		    	<div className="flex-row">
			    	<div className="styled-select">
				    	<select className="select" id="selectAddingObject">
					    	<option>Блок</option>
					    	<option>sample1</option>
					    	<option>sample2</option>
				    	</select>
			    	</div>
			    	<button className="btn" id="addObject">Добавить</button>
		    	</div>
	    	</div>
	    );
	}
}

const changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
	switch (action.type) {
		case ObjectsInteractionEvents.setObjectsInteraction:
			switch(action.value){
				case "copy": 
			}
			break;
		default: break;
	}

	return next(action);
};

const mapStateCanvasProps = (state, ownProps) => {
	return {
		//scene: state.canvas.get(Canvas.scene),
		pickedObjects: state.canvas.get(Canvas.pickedObjects),
		mouseControllerState: state.canvas.get(Canvas.mouseControllerState)
	}
};

const mapDispatchToCanvasProps = (dispatch) => {
	return {
		setNewMouseState: (newMouseState) => {
			dispatch(setMouseProcessingState(newMouseState) )
		}
	}
};


export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(MainControl);
