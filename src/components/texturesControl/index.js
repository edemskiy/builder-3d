import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Canvas} from '../../constants/canvas'
import {PickedObjects} from '../../constants/pickedObjects'


import { setActiveControlMenu } from '../../actions/canvas'

// import { setMouseProcessingState, setObjectsInteraction } from '../../actions/canvas'
// import { EventsState as MouseEventsState } from  '../../constants/mouseEventsController'
// import { EventsState as ObjInteractionEventsState } from  '../../constants/objectsInteraction'
// import { Canvas } from '../../constants/canvas'
// import { positionChange, rotationChange, sizeChange } from '../../actions/pickedObjects'
// import {clearPickedObjects}  from '../../actions/pickedObjects'
// import { PickedObjects } from '../../constants/pickedObjects'


class TexturesControl extends Component {

	componentDidMount(){
		
	}
	componentDidUpdate(prevProps){
		if(this.props.pickedObjects.size > 0 && this.props.activeControlMenu === "TexturesMenu")
			this.refs.main.classList.remove('hidden');
		else
			this.refs.main.classList.add('hidden');
		if(prevProps.pickedObjects !== this.props.pickedObjects && this.props.pickedObjects.size !== 0){
			const currentObj = this.props.pickedObjects.last().getObject();
			if(currentObj.material.diffuseTexture){
				this.refs.changeScale.value = 1/currentObj.getMesh().material.diffuseTexture.uScale;	
				this.refs.xOffset.value = currentObj.getMesh().material.diffuseTexture.uOffset;
				this.refs.yOffset.value = currentObj.getMesh().material.diffuseTexture.vOffset;
			}
		}
	}

	changeScale(){
		this.props.pickedObjects.last().getObject().scaleTexture(parseFloat(this.refs.changeScale.value));
	}
	changeOffsetX(){
		this.props.pickedObjects.last().getObject().offsetTextureX(parseFloat(this.refs.xOffset.value));		
	}
	changeOffsetY(){
		this.props.pickedObjects.last().getObject().offsetTextureY(parseFloat(this.refs.yOffset.value));		
	}

	render(){
	    return (
	    	<div className=" hidden elements-block" ref="main">
		    	<div className="sett-block textures-menu">
		            <div> Масштаб: <input type="number" name="changeScale" min="1" step="0.1" ref="changeScale" onChange={() => this.changeScale()} /> </div>
		            <div> Смещение по x: <input type="number" name="xOffset" min="0" max="1" step="0.05" ref="xOffset" onChange={() => this.changeOffsetX()} /> </div>
		            <div> Смещение по y: <input type="number" name="yOffset" min="0" max="1" step="0.05"ref="yOffset" onChange={() => this.changeOffsetY()} /> </div>
         		</div>
	    	</div>	    	
	    );
	}
}

const mapStateCanvasProps = (state, ownProps) => {
	return {
		 scene: state.canvas.get(Canvas.scene),
		 pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
		 activeControlMenu: state.canvas.get(Canvas.activeControlMenu)
		// mouseControllerState: state.canvas.get(Canvas.mouseControllerState)
	}
};

const mapDispatchToCanvasProps = (dispatch) => {
	return {
		setNewActiveControlMenu: (newActiveControlMenu) => {
         dispatch(setActiveControlMenu(newActiveControlMenu))
      }
	}
};


export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(TexturesControl);
