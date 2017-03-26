import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

const visiableComponentMap = new Map();

class ComponentWrapper extends React.Component {
	constructor(props){
		super(props);
	}
	render(){

	}
}

// const mapStateProps = (state, ownProps) => {
// 	return {}
// }

export default connect(null, null)(ComponentWrapper);