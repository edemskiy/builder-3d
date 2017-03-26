import React, { Component } from 'react';

import { setScene } from '../../actions/canvas'

import Map from '../../graphics/Map'
import Initializer from '../../graphics/Initializer'

import {connect} from 'react-redux';


class Canvas extends Component {
	
	componentDidMount(){

		this.map = new Map(this.refs.renderCanvas);
		this.initializer = new Initializer(this.map.engine);

		this.initializer.createDefaultCamera();
		this.initializer.createDefaultGround();
		this.initializer.createDefaultLight();		
		this.initializer.createDefaultRoom();		

		this.props.setNewScene(this.initializer.scene);

		this.map.runRenderLoop(this.initializer.scene);
	}

	render() {
		return (
			<div>
				<canvas id="renderCanvas" ref='renderCanvas'></canvas>
			</div>
		);
	}
}


const mapDispatchToCanvasProps = (dispatch) => {
	return {
		setNewScene: (scene) => {
			dispatch(setScene(scene))
		}
	}
};


export default connect(null, mapDispatchToCanvasProps)(Canvas);